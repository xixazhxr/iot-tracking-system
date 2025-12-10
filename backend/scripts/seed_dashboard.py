import random
from datetime import date, timedelta
from app import create_app
from utils.db import db
from models.task import Task
from models.issue import Issue
from models.project import Project

app = create_app()

# Force local connection for script execution
app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://root:password@127.0.0.1:3307/iot_tracking"

def seed_data():
    with app.app_context():
        print("Seeding Dashboard Data...")
        
        # Ensure at least one project
        project = Project.query.first()
        if not project:
            project = Project(name="IoT Demo Project", description="Auto-generated project", status="Active")
            db.session.add(project)
            db.session.commit()
            print("Created dummy project.")

        # Seed Tasks for Velocity (Past 7 days)
        statuses = ['To-Do', 'In Progress', 'Done']
        priorities = ['Low', 'Medium', 'High']
        
        for i in range(15):
            days_ago = random.randint(0, 10)
            t_date = date.today() - timedelta(days=days_ago)
            
            task = Task(
                project_id=project.id,
                name=f"Generated Task {i+1}",
                status=random.choice(statuses),
                priority=random.choice(priorities),
                deadline=date.today() + timedelta(days=random.randint(1, 10)),
                assigned_to=random.choice(["Admin", "Aidil", "User"]),
                # Hacky: created_at/updated_at are auto-handled by DB usually, 
                # but we want to simulate history.
                # Since we are using SQLAlchemy, we might need to rely on the default.
                # Ideally we mock the db execution or rely on 'Done' tasks having updated_at.
            )
            db.session.add(task)
        
        # Seed Issues
        issues_severities = ['Low', 'Medium', 'High', 'Critical']
        for i in range(5):
             issue = Issue(
                project_id=project.id,
                title=f"Issue {i+1}",
                severity=random.choice(issues_severities),
                status='Open'
             )
             db.session.add(issue)

        db.session.commit()
        
        # Manually update timestamps for velocity simulation
        # We need raw SQL to bypass onupdate behavior if we want to fake history on 'updated_at'
        # Or just let it be 'now' and velocity will show a spike today. 
        # For 'task velocity', it groups by updated_at date. 
        # Let's try to backdate some 'Done' tasks.
        
        from sqlalchemy import text
        
        # Backdate 3 random Done tasks to yesterday
        db.session.execute(text("UPDATE tasks SET updated_at = DATE_SUB(NOW(), INTERVAL 1 DAY) WHERE status='Done' AND id % 3 = 0"))
        # Backdate 3 random Done tasks to 2 days ago
        db.session.execute(text("UPDATE tasks SET updated_at = DATE_SUB(NOW(), INTERVAL 2 DAY) WHERE status='Done' AND id % 2 = 0"))
        
        db.session.commit()
        print("Data Seeding Complete.")

if __name__ == "__main__":
    seed_data()
