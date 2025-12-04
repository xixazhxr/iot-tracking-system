from sqlalchemy import create_engine, text

# Database connection details for Docker
DATABASE_URI = "mysql+pymysql://root:password@mariadb:3306/iot_tracking"

def update_schema():
    try:
        engine = create_engine(DATABASE_URI)
        with engine.connect() as conn:
            print("Connected to database.")

            # 1. Update Projects Table
            try:
                conn.execute(text("ALTER TABLE projects ADD COLUMN stage VARCHAR(50) DEFAULT 'Planning'"))
                print("Added 'stage' to projects.")
            except Exception as e:
                print(f"Skipping 'stage': {e}")

            try:
                conn.execute(text("ALTER TABLE projects ADD COLUMN priority VARCHAR(50) DEFAULT 'Medium'"))
                print("Added 'priority' to projects.")
            except Exception as e:
                print(f"Skipping 'priority': {e}")

            # 2. Update Tasks Table
            try:
                conn.execute(text("ALTER TABLE tasks ADD COLUMN priority VARCHAR(50) DEFAULT 'Medium'"))
                print("Added 'priority' to tasks.")
            except Exception as e:
                print(f"Skipping 'priority': {e}")

            try:
                conn.execute(text("ALTER TABLE tasks ADD COLUMN parent_id INT NULL"))
                conn.execute(text("ALTER TABLE tasks ADD CONSTRAINT fk_tasks_parent FOREIGN KEY (parent_id) REFERENCES tasks(id) ON DELETE CASCADE"))
                print("Added 'parent_id' to tasks.")
            except Exception as e:
                print(f"Skipping 'parent_id': {e}")

            # 3. Update Project Progress Table
            try:
                conn.execute(text("ALTER TABLE project_progress ADD COLUMN devices_delivered INT DEFAULT 0"))
                print("Added 'devices_delivered' to project_progress.")
            except Exception as e:
                print(f"Skipping 'devices_delivered': {e}")

            try:
                conn.execute(text("ALTER TABLE project_progress ADD COLUMN devices_deployed INT DEFAULT 0"))
                print("Added 'devices_deployed' to project_progress.")
            except Exception as e:
                print(f"Skipping 'devices_deployed': {e}")

            # 4. Create Issues Table
            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS issues (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                title VARCHAR(255),
                description TEXT,
                status VARCHAR(50) DEFAULT 'Open',
                priority VARCHAR(50) DEFAULT 'Medium',
                assigned_to VARCHAR(200),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
            """))
            print("Created/Verified 'issues' table.")

            # 5. Create Comments Table
            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS comments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT NULL,
                task_id INT NULL,
                user_name VARCHAR(200),
                content TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
            )
            """))
            print("Created/Verified 'comments' table.")

            # 6. Create Attachments Table
            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS attachments (
                id INT AUTO_INCREMENT PRIMARY KEY,
                task_id INT,
                file_name VARCHAR(255),
                file_url VARCHAR(500),
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
            )
            """))
            print("Created/Verified 'attachments' table.")

            # 6.1 Update Attachments Table (Add project_id)
            try:
                conn.execute(text("ALTER TABLE attachments ADD COLUMN project_id INT NULL"))
                conn.execute(text("ALTER TABLE attachments ADD CONSTRAINT fk_attachments_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE"))
                print("Added 'project_id' to attachments.")
            except Exception as e:
                print(f"Skipping 'project_id' in attachments: {e}")

            # 7. Create Tracking Tables
            # Hardware
            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS hardware_components (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                name VARCHAR(255),
                status VARCHAR(50),
                datasheet_url VARCHAR(500),
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
            """))
            print("Created/Verified 'hardware_components' table.")

            # Firmware
            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS firmware_versions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                version VARCHAR(50),
                changelog TEXT,
                build_url VARCHAR(500),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
            """))
            print("Created/Verified 'firmware_versions' table.")

            # Testing
            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS test_sessions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                name VARCHAR(255),
                date DATE,
                result VARCHAR(50),
                report_url VARCHAR(500),
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
            """))
            print("Created/Verified 'test_sessions' table.")

            # Deployment
            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS deployment_devices (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                serial_number VARCHAR(100),
                status VARCHAR(50),
                location VARCHAR(255),
                last_ping TIMESTAMP NULL,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
            """))
            print("Created/Verified 'deployment_devices' table.")

            # 8. Create Project Members Table
            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS project_members (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                user_id INT,
                role VARCHAR(50) DEFAULT 'Member',
                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                UNIQUE(project_id, user_id)
            )
            """))
            print("Created/Verified 'project_members' table.")

            # 9. Create Documents Table (for project-level docs)
            conn.execute(text("""
            CREATE TABLE IF NOT EXISTS documents (
                id INT AUTO_INCREMENT PRIMARY KEY,
                project_id INT,
                name VARCHAR(255),
                url VARCHAR(500),
                uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
            )
            """))
            print("Created/Verified 'documents' table.")

    except Exception as e:
        print(f"Error updating schema: {e}")

if __name__ == "__main__":
    update_schema()
