from utils.db import db

class ProjectProgress(db.Model):
    __tablename__ = 'project_progress'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    firmware_status = db.Column(db.String(200))
    hardware_status = db.Column(db.String(200))
    testing_status = db.Column(db.String(200))
    deployment_status = db.Column(db.String(200))
    devices_delivered = db.Column(db.Integer, default=0)
    devices_deployed = db.Column(db.Integer, default=0)
