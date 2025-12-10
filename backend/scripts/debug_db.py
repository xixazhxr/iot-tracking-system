from sqlalchemy import create_engine, text
import socket

def debug_connection(password):
    uri = f"mysql+pymysql://root:{password}@localhost"
    try:
        engine = create_engine(uri)
        with engine.connect() as conn:
            version = conn.execute(text("SELECT @@version")).scalar()
            hostname = conn.execute(text("SELECT @@hostname")).scalar()
            databases = conn.execute(text("SHOW DATABASES")).fetchall()
        print(f"CONNECTED with password: {password}")
        print(f"Server Version: {version}")
        print(f"Server Hostname: {hostname}")
        print(f"Databases: {[db[0] for db in databases]}")
        return True
    except Exception as e:
        print(f"FAILED with password: {password}")
        print(f"Error: {e}")
        return False

print(f"Client Hostname: {socket.gethostname()}")
print("--- Debugging Connection ---")
if not debug_connection("password"):
    print("--- Retrying with alternative password ---")
    debug_connection("asdfghjkl")
