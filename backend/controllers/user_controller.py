from flask import Blueprint
from models.user import User
from models.task import Task
from utils.db import db

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
            "role": "Member", # Default role for now
            "status": "Online", # Mock status
            "workload": workload
        })
        
    return {"users": user_list}
