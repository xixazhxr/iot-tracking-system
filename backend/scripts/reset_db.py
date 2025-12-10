from app import create_app
from utils.db import db
from sqlalchemy import text

app = create_app()

with app.app_context():
    # Disable FK checks to allow dropping tables in any order
    db.session.execute(text('SET FOREIGN_KEY_CHECKS = 0'))
    
    # Get all tables
    tables = db.metadata.tables.keys()
    # Reflect to be sure we get everything in DB
    db.reflect()
    all_tables = db.metadata.tables.keys()
    
    for table in all_tables:
        db.session.execute(text(f'DROP TABLE IF EXISTS {table}'))
        print(f"Dropped {table}")
    
    # Drop alembic_version if it exists (it's not in metadata usually)
    db.session.execute(text('DROP TABLE IF EXISTS alembic_version'))
    print("Dropped alembic_version")

    db.session.execute(text('SET FOREIGN_KEY_CHECKS = 1'))
    db.session.commit()
    print("Database cleared.")
