from utils.db import db

class HardwareComponent(db.Model):
    __tablename__ = 'hardware_components'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    name = db.Column(db.String(255))
    status = db.Column(db.String(50)) # e.g., Designed, Prototyping, Tested
    datasheet_url = db.Column(db.String(500))

class FirmwareVersion(db.Model):
    __tablename__ = 'firmware_versions'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    version = db.Column(db.String(50))
    changelog = db.Column(db.Text)
    build_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, server_default=db.func.now())

class TestSession(db.Model):
    __tablename__ = 'test_sessions'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    name = db.Column(db.String(255))
    date = db.Column(db.Date)
    result = db.Column(db.String(50)) # Pass, Fail, Partial
    report_url = db.Column(db.String(500))

class DeploymentDevice(db.Model):
    __tablename__ = 'deployment_devices'
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('projects.id'))
    serial_number = db.Column(db.String(100))
    status = db.Column(db.String(50)) # Active, Offline, Maintenance
    location = db.Column(db.String(255))
    last_ping = db.Column(db.DateTime)
