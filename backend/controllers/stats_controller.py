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
