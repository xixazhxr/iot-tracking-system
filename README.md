# IoT Project Tracking System

## Overview
A full-stack IoT Project Tracking System built with Flask, React, MariaDB, and Docker.

## Stack
- **Backend**: Flask (Python)
- **Frontend**: React + Tailwind CSS
- **Database**: MariaDB
- **Containerization**: Docker

## Setup

### Prerequisites
- Docker and Docker Compose
- Node.js (for frontend development)

### Running the Backend & Database
1. Run `docker-compose up --build`
2. The backend API will be available at `http://localhost:5000`
3. The database will be initialized with the schema in `database.sql`

### Running the Frontend
1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`
4. Access the app at `http://localhost:5173` (or the port shown in terminal)

## Features
- Project Management
- Task Management
- IoT Specific Progress Tracking
- User Authentication (JWT)
