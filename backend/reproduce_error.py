from app import create_app
from models.project import Project
from utils.db import db
import sys

app = create_app()
with app.app_context():
    try:
        print("Attempting to create project...")
        p = Project(name='Test Project')
        db.session.add(p)
        db.session.commit()
        print("Success!")
    except Exception as e:
        print(f"Failed: {e}")
        import traceback
        traceback.print_exc()
