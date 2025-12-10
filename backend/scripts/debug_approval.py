import requests
import json

BASE_URL = "http://127.0.0.1:5000"

def test_approval_flow():
    # 1. Register a new user
    print("1. Registering new user...")
    reg_data = {
        "name": "Test User",
        "email": "test_approval@example.com",
        "password": "password123",
        "role": "Member" 
    }
    
    # Clean up first if exists (mocking cleanup by just ignoring error or unique constraint will hit)
    # Actually, let's just use a random email or check if we can delete.
    # We don't have a delete endpoint easily accessible without auth.
    # We'll rely on the fact that if it fails, we assume it exists and try to approve it.
    
    try:
        res = requests.post(f"{BASE_URL}/api/auth/register", json=reg_data)
        if res.status_code == 200:
            print("   Registration successful.")
        elif res.status_code == 400:
            print("   User already exists, proceeding.")
        else:
            print(f"   Registration failed: {res.text}")
            return
    except Exception as e:
        print(f"   Connection failed: {e}")
        return

    # 2. Get User ID (we need a way to find the user ID).
    # We need to GET /users/ but that might require no auth or we can use the admin account if we have one.
    # Wait, GET /users/ in user_controller.py currently DOES NOT require @jwt_required ?
    # Let's check user_controller.py.
    
    print("2. Fetching user list to find ID...")
    res = requests.get(f"{BASE_URL}/api/users/")
    if res.status_code != 200:
        print(f"   Failed to fetch users: {res.text}")
        return
        
    users = res.json().get("users", [])
    target_user = next((u for u in users if u["email"] == reg_data["email"]), None)
    
    if not target_user:
        print("   Target user not found in list!")
        return
        
    print(f"   Found user ID: {target_user['id']}, is_approved: {target_user.get('is_approved')}")
    
    if target_user.get('is_approved'):
        print("   User is ALREADY approved? Resetting to False for test...")
        # Reset to false
        requests.put(f"{BASE_URL}/api/users/{target_user['id']}", json={"is_approved": False})
        
    # 3. Approve User
    print(f"3. Approving user {target_user['id']}...")
    res = requests.put(f"{BASE_URL}/api/users/{target_user['id']}", json={"is_approved": True})
    
    if res.status_code == 200:
        print("   Approval request successful.")
    else:
        print(f"   Approval request failed: {res.text}")
        return

    # 4. Verify
    print("4. Verifying status...")
    res = requests.get(f"{BASE_URL}/api/users/")
    users = res.json().get("users", [])
    updated_user = next((u for u in users if u["id"] == target_user["id"]), None)
    
    print(f"   New status: {updated_user.get('is_approved')}")
    if updated_user.get('is_approved') is True:
        print("TEST PASSED: User is approved.")
    else:
        print("TEST FAILED: User is NOT approved.")

if __name__ == "__main__":
    test_approval_flow()
