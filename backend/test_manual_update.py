from app import create_app
from utils.db import db
from models.project import Project

app = create_app()

with app.app_context():
    p = Project.query.first()
    if p:
        print(f"Before: {p.manpower_cost}")
        p.manpower_cost = 123.45
        db.session.commit()
        
        # Refresh
        db.session.expire(p)
        p = Project.query.get(p.id)
        print(f"After: {p.manpower_cost}")
    else:
        print("No project found")
