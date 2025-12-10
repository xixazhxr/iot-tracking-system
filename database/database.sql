CREATE DATABASE IF NOT EXISTS iot_tracking;

USE iot_tracking;

-- Users (login)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200),
    email VARCHAR(200) UNIQUE,
    password VARCHAR(200),
    role VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    customer VARCHAR(200),
    start_date DATE,
    end_date DATE,
    stage VARCHAR(50) DEFAULT 'Planning', -- Planning, Development, Testing, Deployment, Completed
    priority VARCHAR(50) DEFAULT 'Medium',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    name VARCHAR(255),
    description TEXT,
    assigned_to VARCHAR(200), -- Could be user_id in future, keeping simple for now
    status VARCHAR(50) DEFAULT 'To-Do', -- To-Do, In Progress, Testing, Done
    priority VARCHAR(50) DEFAULT 'Medium',
    deadline DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- IoT Progress
CREATE TABLE IF NOT EXISTS project_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    firmware_status VARCHAR(200) DEFAULT 'Pending',
    hardware_status VARCHAR(200) DEFAULT 'Pending', -- PCB, sensors, etc.
    testing_status VARCHAR(200) DEFAULT 'Pending',
    deployment_status VARCHAR(200) DEFAULT 'Pending',
    devices_delivered INT DEFAULT 0,
    devices_deployed INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Issues / Bug Tracking
CREATE TABLE IF NOT EXISTS issues (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT,
    title VARCHAR(255),
    description TEXT,
    status VARCHAR(50) DEFAULT 'Open', -- Open, In Progress, Resolved, Closed
    priority VARCHAR(50) DEFAULT 'Medium',
    assigned_to VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Comments (for Tasks and Projects)
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

-- Attachments
CREATE TABLE IF NOT EXISTS attachments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    file_name VARCHAR(255),
    file_url VARCHAR(500),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);
