from sqlalchemy import create_engine, text
from dotenv import load_dotenv
import os

# Use 3307
db_url = "mysql+pymysql://root:password@127.0.0.1:3307/iot_tracking"

engine = create_engine(db_url)

with engine.connect() as conn:
    result = conn.execute(text("SELECT id, name, email, is_approved FROM users"))
    print(f"{'ID':<5} {'Name':<20} {'Is Approved'}")
    print("-" * 40)
    for row in result:
        print(f"{row[0]:<5} {row[1]:<20} {row[3]}")
