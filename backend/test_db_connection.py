from sqlalchemy import create_engine, text

def test_connection(password):
    uri = f"mysql+pymysql://root:{password}@localhost/iot_tracking"
    try:
        engine = create_engine(uri)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print(f"SUCCESS with password: {password}")
        return True
    except Exception as e:
        print(f"FAILED with password: {password} - {e}")
        return False

print("Testing 'password'...")
if not test_connection("password"):
    print("Testing 'asdfghjkl'...")
    test_connection("asdfghjkl")
