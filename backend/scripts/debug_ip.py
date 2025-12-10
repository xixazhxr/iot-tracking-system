from sqlalchemy import create_engine, text
import socket

def debug_connection(host, password):
    uri = f"mysql+pymysql://root:{password}@{host}/iot_tracking"
    print(f"Testing connection to {host}...")
    try:
        engine = create_engine(uri)
        with engine.connect() as conn:
            version = conn.execute(text("SELECT @@version")).scalar()
            hostname = conn.execute(text("SELECT @@hostname")).scalar()
        print(f"SUCCESS connecting to {host}")
        print(f"Server Version: {version}")
        print(f"Server Hostname: {hostname}")
        return True
    except Exception as e:
        print(f"FAILED connecting to {host}")
        print(f"Error: {e}")
        return False

print("--- Debugging IP vs Localhost ---")
# Test 127.0.0.1
if not debug_connection("127.0.0.1", "password"):
    pass
