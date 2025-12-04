from flask import Blueprint, request
from models.attachment import Attachment
from utils.db import db
import os

attachment_bp = Blueprint("attachments", __name__)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@attachment_bp.post("/upload")
def upload_file():
    if 'file' not in request.files:
        return {"error": "No file part"}, 400
    file = request.files['file']
    if file.filename == '':
        return {"error": "No selected file"}, 400
    
    # In a real app, save to S3 or similar. Here we save locally.
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)
    
    # We expect task_id in form data
    task_id = request.form.get('task_id')
    
    attachment = Attachment(task_id=task_id, file_name=file.filename, file_url=file_path)
    db.session.add(attachment)
    db.session.commit()
    
    return {"message": "File uploaded", "url": file_path}

@attachment_bp.get("/task/<int:task_id>")
def get_attachments(task_id):
    attachments = Attachment.query.filter_by(task_id=task_id).all()
    return {"attachments": [{k: v for k, v in a.__dict__.items() if not k.startswith('_')} for a in attachments]}
