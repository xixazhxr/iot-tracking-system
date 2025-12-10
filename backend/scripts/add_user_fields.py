import os
from sqlalchemy import create_engine, text

# Use 127.0.0.1:3307 as established
DB_URI = "mysql+pymysql://root:password@127.0.0.1:3307/iot_tracking"

def add_columns():
    engine = create_engine(DB_URI)
    with engine.connect() as conn:
        try:
            print("Adding phone column to users...")
            conn.execute(text("ALTER TABLE users ADD COLUMN phone VARCHAR(50);"))
            print("Success.")
        except Exception as e:
            print(f"Error adding phone (might already exist): {e}")

if __name__ == "__main__":
    add_columns()
