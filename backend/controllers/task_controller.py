from flask import Blueprint, request
from models.task import Task
from models.comment import Comment
from models.attachment import Attachment
from models.audit_log import AuditLog
from utils.db import db
from utils.errors import ValidationError, NotFoundError
from datetime import date, timedelta
from sqlalchemy import case

task_bp = Blueprint("tasks", __name__)

def update_overdue_tasks(project_id=None):
    today = date.today()
    query = Task.query.filter(
        Task.deadline != None,
        Task.deadline < today,
        Task.status != 'Done',
        Task.status != 'Overdue'
    )
    if project_id:
        query = query.filter(Task.project_id == project_id)
    
    overdue_tasks = query.all()
    if overdue_tasks:
        for t in overdue_tasks:
            t.status = 'Overdue'
        db.session.commit()

@task_bp.get("/project/<id>")
def get_tasks(id):
    update_overdue_tasks(id)
    
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('search', '')
    status = request.args.get('status', '')

    query = Task.query.filter_by(project_id=id, parent_id=None)

    if search:
        query = query.filter(Task.name.ilike(f'%{search}%'))
    if status and status != 'All':
        query = query.filter(Task.status == status)

    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    tasks = pagination.items

    def serialize_task(t):
        data = {k: v for k, v in t.__dict__.items() if not k.startswith('_')}
        data['subtasks'] = [serialize_task(st) for st in t.subtasks]
        return data

    return {
        "tasks": [serialize_task(t) for t in tasks],
        "pagination": {
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": page,
            "per_page": per_page
        }
    }

@task_bp.get("/")
def get_all_tasks():
    # 1. Update Overdue
    update_overdue_tasks()
    
    today = date.today()
    three_days_from_now = today + timedelta(days=3)

    # 2. Escalate Priority
    urgent_tasks = Task.query.filter(
        Task.deadline != None,
        Task.deadline >= today,
        Task.deadline <= three_days_from_now,
        Task.status != 'Done',
        Task.priority != 'High'
    ).all()
    
    for t in urgent_tasks:
        t.priority = 'High'
    
    if urgent_tasks:
        db.session.commit()

    # 3. Handling Request Params
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    search = request.args.get('search', '')
    status = request.args.get('status', '')
    sort_by = request.args.get('sort_by', 'deadline')
    order = request.args.get('order', 'asc')

    query = Task.query.filter_by(parent_id=None)

    # Filtering
    if search:
        query = query.filter(Task.name.ilike(f'%{search}%'))
    if status and status != 'All':
        query = query.filter(Task.status == status)

    # Sorting
    if sort_by == 'priority':
        priority_order = case(
            (Task.priority == 'High', 1),
            (Task.priority == 'Medium', 2),
            (Task.priority == 'Low', 3),
            else_=4
        )
        if order == 'asc':
            query = query.order_by(priority_order.asc())
        else:
            query = query.order_by(priority_order.desc())
            
    elif sort_by == 'deadline':
        if order == 'desc':
            query = query.order_by(Task.deadline.desc())
        else:
            query = query.order_by(Task.deadline.asc())
            
    # Default fallback sort: ID desc
    query = query.order_by(Task.id.desc())

    # Pagination
    pagination = query.paginate(page=page, per_page=per_page, error_out=False)
    tasks = pagination.items

    return {
        "tasks": [{k: v for k, v in t.__dict__.items() if not k.startswith('_')} for t in tasks],
        "pagination": {
            "total": pagination.total,
            "pages": pagination.pages,
            "current_page": page,
            "per_page": per_page
        }
    }

@task_bp.post("/")
def create_task():
    data = request.json
    if not data or 'name' not in data:
        raise ValidationError("Task name is required")
    
    t = Task(**data)
    db.session.add(t)
    db.session.commit()
    return {"message": "Task added", "id": t.id}

@task_bp.put("/<int:id>")
def update_task(id):
    t = Task.query.get_or_404(id)
    data = request.json
    
    # Immutable fields
    ignored_keys = ['id', 'created_at', 'updated_at']
    
    for key, value in data.items():
        if key not in ignored_keys and hasattr(t, key):
            setattr(t, key, value)
    db.session.commit()
    return {"message": "Task updated"}

@task_bp.delete("/<int:id>")
def delete_task(id):
    t = Task.query.get_or_404(id)
    db.session.delete(t)
    db.session.commit()
    return {"message": "Task deleted"}

@task_bp.post("/cleanup")
def cleanup_tasks():
    today = date.today()
    deleted_count = Task.query.filter(
        (Task.status == 'Done') | ((Task.deadline != None) & (Task.deadline < today))
    ).delete(synchronize_session=False)
    
    db.session.commit()
    return {"message": f"Cleanup complete. {deleted_count} tasks deleted."}

# Comments
@task_bp.get("/<int:id>/comments")
def get_comments(id):
    comments = Comment.query.filter_by(task_id=id).order_by(Comment.created_at.desc()).all()
    return {"comments": [{"id": c.id, "user_name": c.user_name, "content": c.content, "created_at": c.created_at} for c in comments]}

@task_bp.post("/<int:id>/comments")
def add_comment(id):
    data = request.json
    if 'content' not in data or 'user_name' not in data:
        raise ValidationError("Content and user_name are required")
        
    c = Comment(task_id=id, user_name=data['user_name'], content=data['content'])
    db.session.add(c)
    db.session.commit()
    return {"message": "Comment added"}

# Attachments
@task_bp.get("/<int:id>/attachments")
def get_attachments(id):
    attachments = Attachment.query.filter_by(task_id=id).all()
    return {"attachments": [{"id": a.id, "file_name": a.file_name, "file_url": a.file_url, "uploaded_at": a.uploaded_at} for a in attachments]}

@task_bp.post("/<int:id>/attachments")
def add_attachment(id):
    data = request.json
    if 'name' not in data or 'url' not in data:
        raise ValidationError("Name and URL are required")
        
    a = Attachment(task_id=id, file_name=data['name'], file_url=data['url'])
    db.session.add(a)
    db.session.commit()
    return {"message": "Attachment added"}
