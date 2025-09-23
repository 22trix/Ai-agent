# backend/app/routes/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select
from sqlmodel import Session

from .. import models, schemas
from ..database import get_session
from ..security import get_password_hash, verify_password, create_access_token, decode_access_token
from fastapi.security import OAuth2PasswordBearer

router = APIRouter(prefix="/auth", tags=["auth"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.post("/signup", response_model=schemas.UserRead)
def signup(payload: schemas.UserCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(models.User).where(models.User.email == payload.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(
        email=payload.email,
        full_name=payload.full_name,
        hashed_password=get_password_hash(payload.password),
        role=payload.role
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return schemas.UserRead.from_orm(user)

@router.post("/login", response_model=schemas.Token)
def login(payload: schemas.UserCreate, session: Session = Depends(get_session)):
    user = session.exec(select(models.User).where(models.User.email == payload.email)).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    token_data = {"sub": str(user.id), "email": user.email, "role": user.role}
    access_token = create_access_token(token_data)
    return {"access_token": access_token, "token_type": "bearer"}

def get_current_user(token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)) -> models.User:
    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
    user_id = int(payload.get("sub"))
    user = session.get(models.User, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    return user

@router.get("/me", response_model=schemas.UserRead)
def read_current_user(current_user: models.User = Depends(get_current_user)):
    return schemas.UserRead.from_orm(current_user)
