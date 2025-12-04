from flask import Blueprint, request
from models.progress import ProjectProgress
from utils.db import db

progress_bp = Blueprint("progress", __name__)

@progress_bp.post("/")
def update_progress():
    data = request.json
    # Check if progress exists for project, if so update, else create
    p = ProjectProgress.query.filter_by(project_id=data.get("project_id")).first()
    if p:
        for key, value in data.items():
            setattr(p, key, value)
    else:
        p = ProjectProgress(**data)
        db.session.add(p)
    
    db.session.commit()
    return {"message": "Progress updated"}

@progress_bp.get("/project/<id>")
def get_progress(id):
    p = ProjectProgress.query.filter_by(project_id=id).first()
    if p:
        return {k: v for k, v in p.__dict__.items() if not k.startswith('_')}
    return {}
