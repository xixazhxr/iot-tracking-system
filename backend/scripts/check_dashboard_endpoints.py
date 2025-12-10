import requests
import json

BASE_URL = "http://127.0.0.1:5000/api/stats"

endpoints = [
    "/counts",
    "/issues-by-severity",
    "/task-velocity",
    "/team-workload",
    "/pending-approvals",
    "/project-health",
    "/recent-activity"
]

def check_endpoints():
    print(f"Testing endpoints at {BASE_URL}...")
    for ep in endpoints:
        url = f"{BASE_URL}{ep}"
        try:
            res = requests.get(url)
            status = res.status_code
            print(f"[{status}] {ep}")
            if status != 200:
                print(f"   Error: {res.text}")
        except Exception as e:
            print(f"[FAIL] {ep}: {e}")

if __name__ == "__main__":
    check_endpoints()
