# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import init_db
from .routes import auth

app = FastAPI(title="Graduate Job Board - Auth Slice")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # development only; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

app.include_router(auth.router)
