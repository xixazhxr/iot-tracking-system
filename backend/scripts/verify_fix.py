from sqlalchemy import create_engine, text
import socket

def verify_connection(password):
    # Note: Port 3307
    uri = f"mysql+pymysql://root:{password}@localhost:3307/iot_tracking"
    print(f"Testing connection to localhost:3307...")
    try:
        engine = create_engine(uri)
        with engine.connect() as conn:
            version = conn.execute(text("SELECT @@version")).scalar()
            hostname = conn.execute(text("SELECT @@hostname")).scalar()
            databases = conn.execute(text("SHOW DATABASES")).fetchall()
        print(f"SUCCESS connecting to localhost:3307")
        print(f"Server Version: {version}")
        print(f"Server Hostname: {hostname}")
        print(f"Databases: {[db[0] for db in databases]}")
        return True
    except Exception as e:
        print(f"FAILED connecting to localhost:3307")
        print(f"Error: {e}")
        return False

if __name__ == "__main__":
    verify_connection("password")
