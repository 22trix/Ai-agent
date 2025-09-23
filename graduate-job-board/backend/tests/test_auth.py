# backend/tests/test_auth.py
import os
from fastapi.testclient import TestClient
from app.main import app

DB_FILE = "jobboard.db"

def test_signup_and_login_and_me():
    # ensure fresh db
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)

    with TestClient(app) as client:
        # 1. signup
        signup_resp = client.post("/auth/signup", json={
            "email": "alice@example.com",
            "password": "strongpassword",
            "full_name": "Alice",
            "role": "graduate"
        })
        assert signup_resp.status_code == 200
        data = signup_resp.json()
        assert data["email"] == "alice@example.com"
        user_id = data["id"]

        # 2. login
        login_resp = client.post("/auth/login", json={
            "email": "alice@example.com",
            "password": "strongpassword"
        })
        assert login_resp.status_code == 200
        token = login_resp.json()["access_token"]
        assert token

        # 3. call protected /auth/me
        me_resp = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
        assert me_resp.status_code == 200
        me_data = me_resp.json()
        assert me_data["id"] == user_id
        assert me_data["email"] == "alice@example.com"
