from flask import Blueprint, request
from werkzeug.security import generate_password_hash
from models.user import User
from models.task import Task
from utils.db import db
from utils.errors import ValidationError, NotFoundError

user_bp = Blueprint("users", __name__)

@user_bp.get("/")
def get_users():
    users = User.query.all()
    user_list = []
    
    for u in users:
        # Calculate workload based on active tasks
        active_tasks = Task.query.filter_by(assigned_to=u.name).filter(Task.status != 'Done').count()
        # Simple workload calc: 1 task = 20% workload, capped at 100%
        workload = min(100, active_tasks * 20)
        
        user_list.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "role": u.role or "Member",
            "phone": u.phone or "",
            "is_approved": u.is_approved,
            "status": "Online", # Mock status
            "workload": workload
        })
        
    return {"users": user_list}

@user_bp.put("/<int:id>")
def update_user(id):
    u = User.query.get(id)
    if not u:
        raise NotFoundError("User not found")
        
    data = request.json
    
    if 'name' in data:
        u.name = data['name']
    if 'email' in data:
        u.email = data['email']
    if 'role' in data:
        u.role = data['role']
    if 'phone' in data:
        u.phone = data['phone']
    if 'is_approved' in data:
        u.is_approved = data['is_approved']
        
    if 'password' in data and data['password']:
        u.password = generate_password_hash(data['password'])
        
    db.session.commit()
    return {"message": "User updated"}
