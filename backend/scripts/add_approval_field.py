from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

load_dotenv()

# Use 3307 for consistency with previous fixes
db_url = "mysql+pymysql://root:password@127.0.0.1:3307/iot_tracking"

print(f"Connecting to database...")
engine = create_engine(db_url)

with engine.connect() as conn:
    print("Adding is_approved column...")
    try:
        conn.execute(text("ALTER TABLE users ADD COLUMN is_approved BOOLEAN DEFAULT FALSE"))
        print("Column added.")
    except Exception as e:
        print(f"Column might already exist: {e}")

    print("Approving existing users...")
    conn.execute(text("UPDATE users SET is_approved = TRUE"))
    conn.commit()
    print("Done.")
