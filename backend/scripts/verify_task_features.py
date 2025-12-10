import requests
from datetime import date, timedelta

BASE_URL = "http://localhost:5000/api/tasks"

def create_task(name, deadline=None, priority='Medium'):
    payload = {
        "name": name,
        "deadline": str(deadline) if deadline else None,
        "priority": priority,
        "status": "To-Do"
    }
    resp = requests.post(BASE_URL + "/", json=payload)
    return resp.json().get('id')

def test_auto_updates():
    print("--- Testing Auto Updates ---")
    today = date.today()
    yesterday = today - timedelta(days=1)
    tomorrow = today + timedelta(days=1)
    
    # Create overdue task
    t1 = create_task("Overdue Task", yesterday, "Low")
    # Create urgent task (due tomorrow)
    t2 = create_task("Urgent Task", tomorrow, "Low")
    
    # Fetch tasks to trigger update
    resp = requests.get(BASE_URL + "/")
    tasks = resp.json()['tasks']
    
    overdue = next((t for t in tasks if t['id'] == t1), None)
    urgent = next((t for t in tasks if t['id'] == t2), None)
    
    if overdue and overdue['status'] == 'Overdue':
        print("[Pass] Overdue task marked correctly")
    else:
        print(f"[Fail] Overdue task status: {overdue.get('status') if overdue else 'Not Found'}")
        
    if urgent and urgent['priority'] == 'High':
        print("[Pass] Urgent task priority escalated to High")
    else:
        print(f"[Fail] Urgent task priority: {urgent.get('priority') if urgent else 'Not Found'}")

def test_sorting():
    print("\n--- Testing Sorting ---")
    # Fetch sorted by priority
    resp = requests.get(BASE_URL + "/?sort_by=priority&order=asc")
    tasks = resp.json()['tasks']
    priorities = [t['priority'] for t in tasks]
    print(f"Priorities (Ascending High->Low?): {priorities[:5]}")
    
    # Fetch sorted by deadline
    resp = requests.get(BASE_URL + "/?sort_by=deadline&order=asc")
    tasks = resp.json()['tasks']
    deadlines = [t['deadline'] for t in tasks if t['deadline']]
    print(f"Deadlines (Ascending): {deadlines[:3]}")

def test_filtering():
    print("\n--- Testing Filtering ---")
    # Fetch tasks with status 'To-Do'
    resp = requests.get(BASE_URL + "/?status=To-Do")
    tasks = resp.json()['tasks']
    
    invalid_tasks = [t for t in tasks if t['status'] != 'To-Do']
    if not invalid_tasks:
        print(f"[Pass] Filtered {len(tasks)} 'To-Do' tasks correctly. No other statuses found.")
    else:
        print(f"[Fail] Found {len(invalid_tasks)} tasks with wrong status: {[t['status'] for t in invalid_tasks]}")

if __name__ == "__main__":
    try:
        test_auto_updates()
        test_sorting()
        test_filtering()
    except Exception as e:
        print(f"Test Failed: {e}")
