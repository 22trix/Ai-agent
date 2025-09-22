# backend/app/db.py
from sqlmodel import create_engine, SQLModel, Session

sqlite_file_name = "todo.db"
sqlite_url = f"sqlite:///{sqlite_file_name}"

# check_same_thread is required for SQLite when using multiple threads
engine = create_engine(sqlite_url, connect_args={"check_same_thread": False})

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
