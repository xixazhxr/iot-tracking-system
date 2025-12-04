from utils.db import db

class Issue(db.Model):
    __tablename__ = 'issues'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    title = db.Column(db.String(255))
    description = db.Column(db.Text)
    status = db.Column(db.String(50), default='Open')
    priority = db.Column(db.String(50), default='Medium')
    severity = db.Column(db.String(50), default='Medium')
    assigned_to = db.Column(db.String(200))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
