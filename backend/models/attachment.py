from utils.db import db

class Attachment(db.Model):
    __tablename__ = 'attachments'
    id = db.Column(db.Integer, primary_key=True)
    task_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'), nullable=True)
    file_name = db.Column(db.String(255))
    file_url = db.Column(db.String(500))
    uploaded_at = db.Column(db.DateTime, server_default=db.func.now())
