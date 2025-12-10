import os
from sqlalchemy import create_engine, text

# Use localhost:3307 as established in previous fixes
DB_URI = "mysql+pymysql://root:password@localhost:3307/iot_tracking"

def add_columns():
    engine = create_engine(DB_URI)
    with engine.connect() as conn:
        try:
            print("Adding created_at column...")
            conn.execute(text("ALTER TABLE tasks ADD COLUMN created_at DATETIME DEFAULT CURRENT_TIMESTAMP;"))
            print("Success.")
        except Exception as e:
            print(f"Error adding created_at (might already exist): {e}")

        try:
            print("Adding updated_at column...")
            conn.execute(text("ALTER TABLE tasks ADD COLUMN updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;"))
            print("Success.")
        except Exception as e:
            print(f"Error adding updated_at (might already exist): {e}")

if __name__ == "__main__":
    add_columns()
