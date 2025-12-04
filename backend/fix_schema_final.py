from flask import Flask
from utils.db import db
from sqlalchemy import text

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:password@mariadb:3306/iot_tracking'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

def fix_schema():
    with app.app_context():
        # 1. Create project_members table
        try:
            db.session.execute(text("""
                CREATE TABLE IF NOT EXISTS project_members (
                    project_id INT,
                    user_id INT,
                    PRIMARY KEY (project_id, user_id),
                    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                );
            """))
            print("Created project_members table.")
        except Exception as e:
            print(f"Error creating project_members: {e}")

        # 2. Add parent_id to tasks
        try:
            db.session.execute(text("ALTER TABLE tasks ADD COLUMN parent_id INT NULL DEFAULT NULL;"))
            db.session.execute(text("ALTER TABLE tasks ADD CONSTRAINT fk_tasks_parent FOREIGN KEY (parent_id) REFERENCES tasks(id) ON DELETE CASCADE;"))
            print("Added parent_id to tasks.")
        except Exception as e:
            print(f"Error adding parent_id to tasks (might already exist): {e}")

        # 3. Add project_id to attachments
        try:
            db.session.execute(text("ALTER TABLE attachments ADD COLUMN project_id INT NULL DEFAULT NULL;"))
            db.session.execute(text("ALTER TABLE attachments ADD CONSTRAINT fk_attachments_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;"))
            print("Added project_id to attachments.")
        except Exception as e:
            print(f"Error adding project_id to attachments (might already exist): {e}")

        db.session.commit()
        print("Schema fix completed.")

if __name__ == "__main__":
    fix_schema()
