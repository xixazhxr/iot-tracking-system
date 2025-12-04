import requests
import json
import time

BASE_URL = "http://localhost:5000/api"

def test_add_cost():
    # 0. Create new project to avoid locks
    print("Creating new project...")
    new_project = {
        "name": "Cost Test Project",
        "description": "Testing cost persistence",
        "customer": "Tester",
        "start_date": "2023-01-01",
        "end_date": "2023-12-31",
        "priority": "Medium"
    }
    try:
        res = requests.post(f"{BASE_URL}/projects/", json=new_project)
        if res.status_code != 200:
            print(f"Failed to create project: {res.text}")
            return
        project_id = res.json()['id']
        print(f"Created project {project_id}")
        
        # 1. Get current data
        print(f"Fetching project {project_id}...")
        res = requests.get(f"{BASE_URL}/projects/{project_id}")
        data = res.json()
        current_manpower = data.get('manpower_cost', 0) or 0
        print(f"Current Manpower Cost: {current_manpower}")
        
        # 2. Add cost
        add_amount = 50.0
        new_manpower = current_manpower + add_amount
        print(f"Adding {add_amount}. New Total: {new_manpower}")
        
        payload = data
        payload['manpower_cost'] = new_manpower
        
        # 3. Update
        res = requests.put(f"{BASE_URL}/projects/{project_id}", json=payload)
        if res.status_code != 200:
            print(f"Failed to update: {res.text}")
            return
        print("Update successful.")
        
        # 4. Verify
        res = requests.get(f"{BASE_URL}/projects/{project_id}")
        final_data = res.json()
        final_manpower = final_data.get('manpower_cost')
        print(f"Final Manpower Cost: {final_manpower}")
        
        if abs(final_manpower - new_manpower) < 0.01:
            print("SUCCESS: Cost persisted correctly.")
        else:
            print("FAILURE: Cost did not persist.")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_add_cost()
