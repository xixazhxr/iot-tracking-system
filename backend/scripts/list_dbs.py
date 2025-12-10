from sqlalchemy import create_engine, text

def list_databases(password):
    # Connect to no specific database to list them
    uri = f"mysql+pymysql://root:{password}@localhost"
    try:
        engine = create_engine(uri)
        with engine.connect() as conn:
            result = conn.execute(text("SHOW DATABASES"))
            dbs = [row[0] for row in result]
            print(f"Databases found: {dbs}")
            return dbs
    except Exception as e:
        print(f"FAILED to list databases: {e}")
        return []

list_databases("asdfghjkl")
