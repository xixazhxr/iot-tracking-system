from utils.db import db

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    assigned_to = db.Column(db.String(200))
    status = db.Column(db.String(50))
    priority = db.Column(db.String(50), default='Medium')
    deadline = db.Column(db.Date)
    parent_id = db.Column(db.Integer, db.ForeignKey('tasks.id'), nullable=True)

    subtasks = db.relationship('Task', backref=db.backref('parent', remote_side=[id]), lazy=True)
    attachments = db.relationship('Attachment', backref='task', lazy=True)
    comments = db.relationship('Comment', backref='task', lazy=True)
