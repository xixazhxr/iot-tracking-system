from sqlalchemy import create_engine, text

def check_columns():
    uri = "mysql+pymysql://root:asdfghjkl@localhost/project_management"
    engine = create_engine(uri)
    try:
        with engine.connect() as conn:
            result = conn.execute(text("DESCRIBE projects"))
            columns = [row[0] for row in result]
            print(f"Columns in 'projects': {columns}")
            
            required = ['manpower_cost', 'equipment_cost', 'material_cost', 'additional_cost']
            missing = [c for c in required if c not in columns]
            
            if missing:
                print(f"MISSING columns: {missing}")
            else:
                print("ALL cost columns are present.")
    except Exception as e:
        print(f"Error: {e}")

check_columns()
