from flask import Blueprint, request
from models.issue import Issue
from utils.db import db

issue_bp = Blueprint("issues", __name__)

@issue_bp.get("/")
def get_issues():
    project_id = request.args.get('project_id')
    status = request.args.get('status')
    
    query = Issue.query
    if project_id:
        query = query.filter_by(project_id=project_id)
    if status and status != 'All':
        query = query.filter_by(status=status)
        
    issues = query.order_by(Issue.created_at.desc()).all()
    return {"issues": [{k: v for k, v in i.__dict__.items() if not k.startswith('_')} for i in issues]}

@issue_bp.post("/")
def create_issue():
    data = request.json
    issue = Issue(**data)
    db.session.add(issue)
    db.session.commit()
    return {"message": "Issue created", "id": issue.id}

@issue_bp.put("/<int:id>")
def update_issue(id):
    issue = Issue.query.get_or_404(id)
    data = request.json
    for key, value in data.items():
        setattr(issue, key, value)
    db.session.commit()
    return {"message": "Issue updated"}

@issue_bp.delete("/<int:id>")
def delete_issue(id):
    issue = Issue.query.get_or_404(id)
    db.session.delete(issue)
    db.session.commit()
    return {"message": "Issue deleted"}
