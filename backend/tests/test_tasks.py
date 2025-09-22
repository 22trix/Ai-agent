# backend/tests/test_tasks.py
import os
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_crud_tasks():
    # start with a fresh DB for tests
    db_file = "todo.db"
    if os.path.exists(db_file):
        os.remove(db_file)

    # trigger startup to create DB
    client.get("/health")

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
    r = client.put(f"/tasks/{task_id}", json={"id": task_id, "title": "Updated", "description": None, "completed": True})
    assert r.status_code == 200
    assert r.json()["completed"] is True

    # delete
    r = client.delete(f"/tasks/{task_id}")
    assert r.status_code == 204
