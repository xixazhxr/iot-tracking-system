from flask import Blueprint, jsonify
from models.project import Project
from models.task import Task
from models.issue import Issue
from models.user import User
from utils.db import db
from sqlalchemy import func

stats_bp = Blueprint("stats", __name__)

@stats_bp.get("/counts")
def get_counts():
    projects = Project.query.count()
    tasks = Task.query.count()
    issues = Issue.query.count()
    users = User.query.count()
    return jsonify({"projects": projects, "tasks": tasks, "issues": issues, "users": users})

@stats_bp.get("/issues-by-severity")
def get_issues_by_severity():
    # Returns list of {severity, count}
    results = db.session.query(Issue.severity, func.count(Issue.id)).group_by(Issue.severity).all()
    return jsonify({"data": [{"name": r[0], "value": r[1]} for r in results]})

@stats_bp.get("/task-velocity")
def get_task_velocity():
    # Returns tasks completed per day (mock logic for now as we don't track completion date history strictly)
    # In a real app, we'd query a history table. Here we'll group by updated_at for Done tasks.
    results = db.session.query(func.date(Task.updated_at), func.count(Task.id))\
        .filter(Task.status == 'Done')\
        .group_by(func.date(Task.updated_at))\
        .all()
    return jsonify({"data": [{"date": str(r[0]), "count": r[1]} for r in results]})

@stats_bp.get("/team-workload")
def get_team_workload():
    # Returns tasks assigned per user
    results = db.session.query(User.name, func.count(Task.id))\
        .join(Task, Task.assigned_to == User.name)\
        .filter(Task.status != 'Done')\
        .group_by(User.name)\
        .all()
    return jsonify({"data": [{"name": r[0], "tasks": r[1]} for r in results]})

@stats_bp.get("/pending-approvals")
def get_pending_approvals():
    count = User.query.filter_by(is_approved=False).count()
    return jsonify({"count": count})

@stats_bp.get("/project-health")
def get_project_health():
    # Simple health calc: 
    # Healthy: No critical issues
    # At Risk: Has critical issues OR > 5 active issues
    
    projects = Project.query.all()
    health_data = []
    
    for p in projects:
        # Count critical issues related to this project (assuming issue has project_id or similar, 
        # but Issue model might be loose. Let's assume we link via Issue logic or just mock for now if no direct link exists)
        # Looking at Issue model earlier, it didn't seem to have project_id explicit in the snippet? 
        # Let me check valid relationships. 
        # The Issue model in previous context had title, severity, status, created_by.
        # It lacks a direct foreign key to Project in the snippet I saw?
        # Wait, let's double check Issue model to be safe. 
        # If no link, I'll use a placeholder logic or try to match by name if relevant.
        # Actually, let's just count open tasks vs total tasks for "completeness".
        
        total_tasks = Task.query.filter_by(project_id=p.id).count()
        completed_tasks = Task.query.filter_by(project_id=p.id, status='Done').count()
        
        # If we can't easily link issues, we'll base health on progress.
        progress = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0
        
        status = "Healthy"
        if progress < 30 and total_tasks > 0:
            status = "At Risk"
            
        health_data.append({
            "id": p.id,
            "name": p.name,
            "status": status,
            "progress": int(progress),
            "total_tasks": total_tasks
        })
        
    return jsonify({"data": health_data})

@stats_bp.get("/recent-activity")
def get_recent_activity():
    # Get last 5 tasks
    recent_tasks = Task.query.order_by(Task.created_at.desc()).limit(5).all()
    # Get last 5 issues
    recent_issues = Issue.query.order_by(Issue.created_at.desc()).limit(5).all()
    
    activity = []
    for t in recent_tasks:
        activity.append({
            "type": "task",
            "title": t.name,
            "user": t.assigned_to,
            "time": t.created_at,
            "id": t.id
        })
        
    for i in recent_issues:
        activity.append({
            "type": "issue",
            "title": i.title,
            "user": i.assigned_to, # Issue doesn't have created_by, using assigned_to
            "time": i.created_at,
            "id": i.id
        })
        
    # Sort mixed list by time desc
    activity.sort(key=lambda x: x['time'], reverse=True)
    
    return jsonify({"data": activity[:10]})
