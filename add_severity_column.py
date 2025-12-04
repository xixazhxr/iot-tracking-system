from app import create_app
from utils.db import db
from sqlalchemy import text

app = create_app()

with app.app_context():
    try:
        with db.engine.connect() as conn:
            conn.execute(text("ALTER TABLE issues ADD COLUMN severity VARCHAR(50) DEFAULT 'Medium'"))
            conn.commit()
        print("Successfully added severity column to issues table.")
    except Exception as e:
        print(f"Error: {e}")
