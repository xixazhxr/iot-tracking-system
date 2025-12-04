from flask import Blueprint, request
from models.task import Task
from models.comment import Comment
from models.attachment import Attachment
from utils.db import db

task_bp = Blueprint("tasks", __name__)

@task_bp.get("/project/<id>")
def get_tasks(id):
    # Check for overdue tasks and update them
    from datetime import date
    today = date.today()
    
    overdue_tasks = Task.query.filter(
        Task.project_id == id,
        Task.deadline != None,
        Task.deadline < today,
        Task.status != 'Done',
        Task.status != 'Overdue'
    ).all()
    
    if overdue_tasks:
        for t in overdue_tasks:
            t.status = 'Overdue'
        db.session.commit()

    # Only get top-level tasks (no parent)
    tasks = Task.query.filter_by(project_id=id, parent_id=None).all()
    
    def serialize_task(t):
        data = {k: v for k, v in t.__dict__.items() if not k.startswith('_')}
        data['subtasks'] = [serialize_task(st) for st in t.subtasks]
        return data

    return {"tasks": [serialize_task(t) for t in tasks]}

@task_bp.get("/")
def get_all_tasks():
    # Check for overdue tasks globally
    from datetime import date
    today = date.today()
    
    overdue_tasks = Task.query.filter(
        Task.deadline != None,
        Task.deadline < today,
        Task.status != 'Done',
        Task.status != 'Overdue'
    ).all()
    
    if overdue_tasks:
        for t in overdue_tasks:
            t.status = 'Overdue'
        db.session.commit()

    tasks = Task.query.filter_by(parent_id=None).all()
    return {"tasks": [{k: v for k, v in t.__dict__.items() if not k.startswith('_')} for t in tasks]}

@task_bp.post("/")
def create_task():
    data = request.json
    t = Task(**data)
    db.session.add(t)
    db.session.commit()
    return {"message": "Task added", "id": t.id}

@task_bp.put("/<int:id>")
def update_task(id):
    t = Task.query.get_or_404(id)
    data = request.json
    for key, value in data.items():
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
    # Delete tasks that are 'Done' OR past deadline
    from datetime import date
    today = date.today()
    
    # Logic: Delete if status is 'Done' OR (deadline is not null AND deadline < today)
    # Note: User asked for "auto delete of the task already done or finish after deadline"
    # We will delete tasks that are marked 'Done'.
    # We will also delete tasks that are overdue (deadline < today) regardless of status? 
    # Or maybe only if they are done? "finish after deadline" is ambiguous.
    # Let's assume: Delete 'Done' tasks. Delete tasks where deadline < today.
    
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
    a = Attachment(task_id=id, file_name=data['name'], file_url=data['url'])
    db.session.add(a)
    db.session.commit()
    return {"message": "Attachment added"}
