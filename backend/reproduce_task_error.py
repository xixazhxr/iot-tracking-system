from app import create_app
from models.task import Task
from models.project import Project
from utils.db import db
import sys

app = create_app()
with app.app_context():
    try:
        print("Attempting to create task...")
        # Ensure a project exists
        p = Project.query.first()
        if not p:
            print("Creating dummy project...")
            p = Project(name="Dummy")
            db.session.add(p)
            db.session.commit()
        
        t = Task(
            project_id=p.id,
            name="Test Task",
            description="Desc",
            assigned_to="Alice",
            status="In Progress",
            priority="High",
            deadline="2023-02-01"
        )
        db.session.add(t)
        db.session.commit()
        print("Success!")
    except Exception as e:
        print(f"Failed: {e}")
        import traceback
        traceback.print_exc()
