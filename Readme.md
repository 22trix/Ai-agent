# 📝 Simple ToDo App

A simple **ToDo application** built with **FastAPI (backend)** and **HTML/JS (frontend)**.  
The project demonstrates CRUD operations (Create, Read, Update, Delete) with tasks, using **SQLite** as the database.

---

## 🚀 Features
- Add new tasks
- Mark tasks as completed
- Delete tasks
- Simple UI for interaction
- RESTful API with FastAPI
- Unit tests with Pytest

---

## 📂 Project Structure
```
todo-app/
│── backend/
│   ├── app/
│   │   ├── main.py        # FastAPI application
│   │   ├── models.py      # SQLAlchemy models
│   │   ├── database.py    # DB setup (SQLite + SQLAlchemy)
│   │   └── schemas.py     # Pydantic schemas
│   ├── tests/
│   │   └── test_tasks.py  # Pytest for CRUD operations
│   └── requirements.txt   # Dependencies
│
│── frontend/
│   ├── index.html         # Simple ToDo UI
│   └── script.js          # Fetch API calls
│
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/todo-app.git
cd todo-app/backend
```

### 2. Create a virtual environment & activate it
```bash
python3 -m venv venv
source venv/bin/activate   # On Windows use venv\Scripts\activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run database migrations
```bash
python -m app.database
```

### 5. Start the backend server
```bash
uvicorn app.main:app --reload
```

### 6. Open frontend
Just open `frontend/index.html` in your browser.  
Make sure the backend (`http://127.0.0.1:8000`) is running.

---

## 🧪 Running Tests
```bash
pytest
```

---

## 📡 API Endpoints

- `GET /tasks` → Get all tasks
- `POST /tasks` → Create new task
- `PUT /tasks/{id}` → Update task (mark completed / edit)
- `DELETE /tasks/{id}` → Delete task

---

## 🌟 Future Improvements
- Improve frontend UI (Bootstrap/Tailwind/React)
- Add user authentication
- Deploy on cloud (Heroku/AWS/GCP)
- Add Docker support
