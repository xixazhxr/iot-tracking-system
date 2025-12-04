from utils.db import db

class Comment(db.Model):
    __tablename__ = 'comments'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=True)
    user_name = db.Column(db.String(200))
    content = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
