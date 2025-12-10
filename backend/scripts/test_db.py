from sqlalchemy import create_engine
import sys

DATABASE_URI = "mysql+pymysql://root:password@127.0.0.1:3306"

try:
    engine = create_engine(DATABASE_URI)
    with engine.connect() as conn:
        print("Success!")
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
