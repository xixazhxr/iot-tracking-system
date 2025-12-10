-- 1. Update Projects Table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS stage VARCHAR(50) DEFAULT 'Planning';
ALTER TABLE projects ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Medium';

-- 2. Update Tasks Table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority VARCHAR(50) DEFAULT 'Medium';

-- 3. Update Project Progress Table
ALTER TABLE project_progress ADD COLUMN IF NOT EXISTS devices_delivered INT DEFAULT 0;
ALTER TABLE project_progress ADD COLUMN IF NOT EXISTS devices_deployed INT DEFAULT 0;

-- 4. Create Issues Table
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
);

-- 5. Create Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NULL,
    task_id INT NULL,
    user_name VARCHAR(200),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- 6. Create Attachments Table
CREATE TABLE IF NOT EXISTS attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    file_name VARCHAR(255),
    file_url VARCHAR(500),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
