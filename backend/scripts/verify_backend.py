import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_backend():
    print("Testing Backend...")
    
    # 1. Create Project
    print("\n1. Creating Project...")
    project_data = {
        "name": "Smart Home Hub",
        "description": "Central hub for smart home devices",
        "customer": "TechCorp",
        "start_date": "2023-01-01",
        "end_date": "2023-12-31",
        "stage": "Development",
        "priority": "High"
    }
    res = requests.post(f"{BASE_URL}/projects/", json=project_data)
    print(f"Create Project: {res.status_code}")
    if res.status_code != 200:
        print(f"Error Response: {res.text}")
        return
    print(f"Response: {res.json()}")
    project_id = res.json().get("id")

    # 2. Update Project
    print("\n2. Updating Project...")
    res = requests.put(f"{BASE_URL}/projects/{project_id}", json={"stage": "Testing"})
    print(f"Update Project: {res.status_code} - {res.json()}")

    # 3. Create Task
    print("\n3. Creating Task...")
    task_data = {
        "project_id": project_id,
        "name": "Design PCB",
        "description": "Design the main control board",
        "assigned_to": "Alice",
        "status": "In Progress",
        "priority": "High",
        "deadline": "2023-02-01"
    }
    res = requests.post(f"{BASE_URL}/tasks/", json=task_data)
    print(f"Create Task: {res.status_code} - {res.json()}")
    task_id = res.json().get("id")

    # 4. Create Issue
    print("\n4. Creating Issue...")
    issue_data = {
        "project_id": project_id,
        "title": "Overheating",
        "description": "MCU overheats after 1 hour",
        "status": "Open",
        "priority": "Critical",
        "assigned_to": "Bob"
    }
    res = requests.post(f"{BASE_URL}/issues/", json=issue_data)
    print(f"Create Issue: {res.status_code} - {res.json()}")

    # 5. Add Comment
    print("\n5. Adding Comment...")
    comment_data = {
        "task_id": task_id,
        "user_name": "Alice",
        "content": "PCB design 90% complete"
    }
    res = requests.post(f"{BASE_URL}/comments/", json=comment_data)
    print(f"Add Comment: {res.status_code} - {res.json()}")

    # 6. Update IoT Progress
    print("\n6. Updating IoT Progress...")
    progress_data = {
        "project_id": project_id,
        "firmware_status": "v0.1 Alpha",
        "hardware_status": "Prototype 1",
        "devices_delivered": 5
    }
    res = requests.post(f"{BASE_URL}/progress/", json=progress_data)
    print(f"Update Progress: {res.status_code} - {res.json()}")

    # 7. Get Project Details
    print("\n7. Getting Project Details...")
    res = requests.get(f"{BASE_URL}/projects/{project_id}")
    print(f"Get Project: {res.status_code} - {res.json()}")

    print("\nBackend Test Complete!")

if __name__ == "__main__":
    test_backend()
