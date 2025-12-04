from app import create_app
from utils.db import db
from sqlalchemy import text

app = create_app()

with app.app_context():
    with db.engine.connect() as conn:
        # Add columns if they don't exist
        try:
            conn.execute(text("ALTER TABLE projects ADD COLUMN manpower_cost FLOAT DEFAULT 0.0"))
            print("Added manpower_cost")
        except Exception as e:
            print(f"manpower_cost might already exist: {e}")

        try:
            conn.execute(text("ALTER TABLE projects ADD COLUMN equipment_cost FLOAT DEFAULT 0.0"))
            print("Added equipment_cost")
        except Exception as e:
            print(f"equipment_cost might already exist: {e}")

        try:
            conn.execute(text("ALTER TABLE projects ADD COLUMN material_cost FLOAT DEFAULT 0.0"))
            print("Added material_cost")
        except Exception as e:
            print(f"material_cost might already exist: {e}")

        try:
            conn.execute(text("ALTER TABLE projects ADD COLUMN additional_cost FLOAT DEFAULT 0.0"))
            print("Added additional_cost")
        except Exception as e:
            print(f"additional_cost might already exist: {e}")
            
        conn.commit()
        print("Schema update complete.")
