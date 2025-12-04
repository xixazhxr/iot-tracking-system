from utils.db import db

class Project(db.Model):
    __tablename__ = 'projects'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)
    customer = db.Column(db.String(200))
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    status = db.Column(db.String(50))
    stage = db.Column(db.String(50), default='Planning')
    priority = db.Column(db.String(50))
    
    # Cost Tracking
    manpower_cost = db.Column(db.Float, default=0.0)
    equipment_cost = db.Column(db.Float, default=0.0)
    material_cost = db.Column(db.Float, default=0.0)
    additional_cost = db.Column(db.Float, default=0.0)

    members = db.relationship('User', secondary='project_members', backref='projects')
    attachments = db.relationship('Attachment', backref='project', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "customer": self.customer,
            "start_date": str(self.start_date) if self.start_date else None,
            "end_date": str(self.end_date) if self.end_date else None,
            "status": self.status,
            "stage": self.stage,
            "priority": self.priority,
            "manpower_cost": self.manpower_cost,
            "equipment_cost": self.equipment_cost,
            "material_cost": self.material_cost,
            "additional_cost": self.additional_cost,
            "members": [{"id": m.id, "name": m.name, "email": m.email, "role": m.role} for m in self.members],
            "attachments": [{"id": a.id, "file_name": a.file_name, "file_url": a.file_url, "uploaded_at": a.uploaded_at} for a in self.attachments]
        }

project_members = db.Table('project_members',
    db.Column('project_id', db.Integer, db.ForeignKey('projects.id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True)
)
