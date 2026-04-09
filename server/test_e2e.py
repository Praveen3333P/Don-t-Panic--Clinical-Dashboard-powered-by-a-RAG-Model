import requests
import json
import os
from pathlib import Path

BASE_URL = "http://127.0.0.1:8000"

def test_flow():
    print("1. Testing Health...")
    r = requests.get(f"{BASE_URL}/api/health")
    print("Health:", r.status_code, r.json())
    
    print("\n2. Testing Registration...")
    import time
    email = f"test_{int(time.time())}@neural.com"
    password = "password123"
    r = requests.post(
        f"{BASE_URL}/api/auth/signup",
        json={"email": email, "password": password}
    )
    print("Signup Code:", r.status_code)
    try:
        print("Signup Body:", r.json())
    except:
        pass
    
    print("\n3. Testing Login...")
    r = requests.post(
        f"{BASE_URL}/api/auth/token",
        json={"email": email, "password": password}
    )
    print("Login Code:", r.status_code)
    if r.status_code != 200:
        print("Failed to login, exiting.")
        return
        
    token = r.json()["access_token"]
    print(f"Obtained token: {token[:20]}...")
    
    print("\n4. Testing Lab Report Upload...")
    pdf_path = Path("laboratory-reference-ranges.pdf")
    if not pdf_path.exists():
        print("PDF not found for testing!")
        return
        
    with open(pdf_path, 'rb') as f:
        files = {'file': (pdf_path.name, f, 'application/pdf')}
        headers = {'Authorization': f'Bearer {token}'}
        print("Sending POST request to /api/neutralize (this will take 10-30s)...")
        r = requests.post(f"{BASE_URL}/api/neutralize", headers=headers, files=files)
        
    print("Neutralize Code:", r.status_code)
    try:
        resp = r.json()
        print("Neutralize Response Keys:", resp.keys())
        print("Patient Summary:", resp.get("patient_summary"))
        print("Results Count:", len(resp.get("results", [])))
        if resp.get("results"):
            print("First Result:", resp["results"][0])
    except Exception as e:
        print("Failed to parse response:", r.text)

if __name__ == "__main__":
    test_flow()
