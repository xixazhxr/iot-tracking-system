from flask import Blueprint, request
from models.project import Project
from models.user import User
from models.attachment import Attachment
from utils.db import db

project_bp = Blueprint("projects", __name__)

@project_bp.get("/")
def get_projects():
    projects = Project.query.all()
    return {"projects": [p.to_dict() for p in projects]}

@project_bp.post("/")
def create_project():
    try:
        data = request.json
        p = Project(**data)
        db.session.add(p)
        db.session.commit()
        return {"message": "Project created", "id": p.id}
    except Exception as e:
        return {"error": str(e)}, 500

@project_bp.get("/<int:id>")
def get_project(id):
    p = Project.query.get_or_404(id)
    return p.to_dict()

@project_bp.get("/users/search")
def search_users():
    query = request.args.get('q', '')
    if not query:
        return {"users": []}
    users = User.query.filter(User.name.ilike(f'%{query}%') | User.email.ilike(f'%{query}%')).limit(10).all()
    return {"users": [{"id": u.id, "name": u.name, "email": u.email} for u in users]}

@project_bp.put("/<int:id>")
def update_project(id):
    p = Project.query.get_or_404(id)
    data = request.json
    print(f"DEBUG: Received update for project {id}: {data}")
    for key, value in data.items():
        if key not in ['id', 'members', 'attachments', '_sa_instance_state']:
            print(f"DEBUG: Setting {key} to {value}")
            setattr(p, key, value)
    try:
        db.session.commit()
        print("DEBUG: Commit successful")
    except Exception as e:
        print(f"DEBUG: Commit failed: {e}")
        db.session.rollback()
        return {"error": str(e)}, 500
    return {"message": "Project updated"}
@project_bp.delete("/<int:id>")
def delete_project(id):
    p = Project.query.get_or_404(id)
    db.session.delete(p)
    db.session.commit()
    return {"message": "Project deleted"}

@project_bp.post("/<int:id>/members")
def add_member(id):
    p = Project.query.get_or_404(id)
    data = request.json
    user = User.query.get(data['user_id'])
    if user and user not in p.members:
        p.members.append(user)
        db.session.commit()
    return {"message": "Member added"}

@project_bp.delete("/<int:id>/members/<int:user_id>")
def remove_member(id, user_id):
    p = Project.query.get_or_404(id)
    user = User.query.get(user_id)
    if user and user in p.members:
        p.members.remove(user)
        db.session.commit()
    return {"message": "Member removed"}

@project_bp.post("/<int:id>/documents")
def upload_document(id):
    # This is a placeholder for actual file upload logic
    # In a real app, we would handle file storage here
    data = request.json
    att = Attachment(project_id=id, file_name=data['name'], file_url=data['url'])
    db.session.add(att)
    db.session.commit()
    return {"message": "Document uploaded"}
