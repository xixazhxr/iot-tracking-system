import urllib.request
import json

url = "http://localhost:5000/api/auth/login"
data = {
    "email": "admin@example.com",
    "password": "password123"
}

req = urllib.request.Request(
    url, 
    data=json.dumps(data).encode('utf-8'), 
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req) as response:
        print(f"Status Code: {response.getcode()}")
        resp_data = json.loads(response.read().decode('utf-8'))
        if "token" in resp_data:
            print("Login Successful")
        else:
            print("Login Failed: No token")
except urllib.error.HTTPError as e:
    print(f"HTTP Error: {e.code}")
    print(f"Response: {e.read().decode('utf-8')}")
except Exception as e:
    print(f"Error: {e}")
