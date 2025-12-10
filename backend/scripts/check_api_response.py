import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def check_structure():
    print("Fetching users...")
    try:
        res = requests.get(f"{BASE_URL}/api/users/")
        if res.status_code == 200:
            data = res.json()
            users = data.get("users", [])
            if users:
                print("First user sample:")
                print(json.dumps(users[0], indent=2))
                if 'is_approved' not in users[0]:
                    print("CRITICAL: 'is_approved' key is MISSING from response!")
                else:
                    print(f"Status of 'is_approved': {users[0]['is_approved']}")
            else:
                print("No users found.")
        else:
            print(f"Error: {res.status_code} {res.text}")
    except Exception as e:
        print(f"Connection error: {e}")

if __name__ == "__main__":
    check_structure()
