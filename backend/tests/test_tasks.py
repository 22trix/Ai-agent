# backend/tests/test_tasks.py
import os
from fastapi.testclient import TestClient
from app.main import app

def test_crud_tasks():
    # Ensure a fresh DB for this test run: delete DB file if it exists
    db_file = "todo.db"
    if os.path.exists(db_file):
        os.remove(db_file)

    # Create the TestClient after removing the DB so startup event recreates tables
    with TestClient(app) as client:
        # trigger startup (happens on client enter)
        r = client.get("/health")
        assert r.status_code == 200

        # create
        r = client.post("/tasks", json={"title": "Test task"})
        assert r.status_code == 201
        data = r.json()
        assert data["title"] == "Test task"
        task_id = data["id"]

        # list
        r = client.get("/tasks")
        assert r.status_code == 200
        assert any(t["id"] == task_id for t in r.json())

        # update
        r = client.put(f"/tasks/{task_id}", json={
            "id": task_id,
            "title": "Updated",
            "description": None,
            "completed": True
        })
        assert r.status_code == 200
        assert r.json()["completed"] is True

        # delete
        r = client.delete(f"/tasks/{task_id}")
        assert r.status_code == 204
