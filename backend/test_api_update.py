import requests

BASE_URL = "http://localhost:5000/api"

def test_update():
    # 1. Get projects
    res = requests.get(f"{BASE_URL}/projects/")
    projects = res.json().get("projects", [])
    if not projects:
        print("No projects found to test.")
        return

    pid = projects[0]['id']
    print(f"Testing with Project ID: {pid}")

    # 2. Update costs
    payload = {
        "manpower_cost": 100.50,
        "equipment_cost": 200.00,
        "material_cost": 50.00,
        "additional_cost": 10.00
    }
    print(f"Sending payload: {payload}")
    res = requests.put(f"{BASE_URL}/projects/{pid}", json=payload)
    print(f"Update response: {res.status_code} - {res.text}")

    # 3. Verify
    res = requests.get(f"{BASE_URL}/projects/{pid}")
    data = res.json()
    print("Fetched updated project data:")
    print(f"Manpower: {data.get('manpower_cost')}")
    print(f"Equipment: {data.get('equipment_cost')}")
    
    if data.get('manpower_cost') == 100.5:
        print("SUCCESS: Data persisted.")
    else:
        print("FAILURE: Data did not persist.")

if __name__ == "__main__":
    test_update()
