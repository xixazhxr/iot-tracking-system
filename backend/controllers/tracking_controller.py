from flask import Blueprint, request
from models.tracking import HardwareComponent, FirmwareVersion, TestSession, DeploymentDevice
from utils.db import db

tracking_bp = Blueprint("tracking", __name__)

# Hardware
@tracking_bp.get("/hardware/<project_id>")
def get_hardware(project_id):
    items = HardwareComponent.query.filter_by(project_id=project_id).all()
    return {"items": [{k: v for k, v in i.__dict__.items() if not k.startswith('_')} for i in items]}

@tracking_bp.post("/hardware/<project_id>")
def add_hardware(project_id):
    data = request.json
    item = HardwareComponent(project_id=project_id, **data)
    db.session.add(item)
    db.session.commit()
    return {"message": "Hardware added", "id": item.id}

@tracking_bp.delete("/hardware/<int:id>")
def delete_hardware(id):
    item = HardwareComponent.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return {"message": "Hardware deleted"}

# Firmware
@tracking_bp.get("/firmware/<project_id>")
def get_firmware(project_id):
    items = FirmwareVersion.query.filter_by(project_id=project_id).order_by(FirmwareVersion.created_at.desc()).all()
    return {"items": [{k: v for k, v in i.__dict__.items() if not k.startswith('_')} for i in items]}

@tracking_bp.post("/firmware/<project_id>")
def add_firmware(project_id):
    data = request.json
    item = FirmwareVersion(project_id=project_id, **data)
    db.session.add(item)
    db.session.commit()
    return {"message": "Firmware added", "id": item.id}

@tracking_bp.delete("/firmware/<int:id>")
def delete_firmware(id):
    item = FirmwareVersion.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return {"message": "Firmware deleted"}

# Testing
@tracking_bp.get("/testing/<project_id>")
def get_testing(project_id):
    items = TestSession.query.filter_by(project_id=project_id).order_by(TestSession.date.desc()).all()
    return {"items": [{k: v for k, v in i.__dict__.items() if not k.startswith('_')} for i in items]}

@tracking_bp.post("/testing/<project_id>")
def add_testing(project_id):
    data = request.json
    item = TestSession(project_id=project_id, **data)
    db.session.add(item)
    db.session.commit()
    return {"message": "Test session added", "id": item.id}

@tracking_bp.delete("/testing/<int:id>")
def delete_testing(id):
    item = TestSession.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return {"message": "Test session deleted"}

# Deployment
@tracking_bp.get("/deployment/<project_id>")
def get_deployment(project_id):
    items = DeploymentDevice.query.filter_by(project_id=project_id).all()
    return {"items": [{k: v for k, v in i.__dict__.items() if not k.startswith('_')} for i in items]}

@tracking_bp.post("/deployment/<project_id>")
def add_deployment(project_id):
    data = request.json
    item = DeploymentDevice(project_id=project_id, **data)
    db.session.add(item)
    db.session.commit()
    return {"message": "Device added", "id": item.id}

@tracking_bp.delete("/deployment/<int:id>")
def delete_deployment(id):
    item = DeploymentDevice.query.get_or_404(id)
    db.session.delete(item)
    db.session.commit()
    return {"message": "Device deleted"}
