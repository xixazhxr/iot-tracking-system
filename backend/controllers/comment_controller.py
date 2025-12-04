from flask import Blueprint, request
from models.comment import Comment
from utils.db import db

comment_bp = Blueprint("comments", __name__)

@comment_bp.get("/project/<int:project_id>")
def get_project_comments(project_id):
    comments = Comment.query.filter_by(project_id=project_id).all()
    return {"comments": [{k: v for k, v in c.__dict__.items() if not k.startswith('_')} for c in comments]}

@comment_bp.get("/task/<int:task_id>")
def get_task_comments(task_id):
    comments = Comment.query.filter_by(task_id=task_id).all()
    return {"comments": [{k: v for k, v in c.__dict__.items() if not k.startswith('_')} for c in comments]}

@comment_bp.post("/")
def add_comment():
    data = request.json
    comment = Comment(**data)
    db.session.add(comment)
    db.session.commit()
    return {"message": "Comment added", "id": comment.id}
