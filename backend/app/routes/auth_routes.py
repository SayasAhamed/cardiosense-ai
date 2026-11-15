from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db, SessionLocal
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserLogin

# Use ONLY security.py for password hashing & verification
from app.auth.security import hash_password, verify_password

from app.auth.jwt_handler import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

# ==========================================
# REGISTER USER
# ==========================================

@router.post("/register")
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered."
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        hashed_password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": "User registered successfully."
    }


# ==========================================
# LOGIN
# ==========================================

@router.post("/login")
def login(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    db_user = db.query(User).filter(
        User.email == user_data.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password."
        )

    # Verify bcrypt password
    if not verify_password(
        user_data.password,
        db_user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password."
        )

    access_token = create_access_token(
        data={
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": db_user.role,
        "full_name": db_user.full_name,
        "email": db_user.email
    }


# ==========================================
# GET ALL USERS
# ==========================================

@router.get("/users")
def get_users(
    db: Session = Depends(get_db)
):
    return db.query(User).all()


# ==========================================
# DELETE USER
# ==========================================

@router.delete("/users/{user_id}")
def delete_user(user_id: int):
    db = SessionLocal()

    try:
        user = db.query(User).filter(
            User.id == user_id
        ).first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found."
            )

        # Protect the admin account
        if user.role.upper() == "ADMIN":
            raise HTTPException(
                status_code=403,
                detail="Admin account cannot be deleted."
            )

        db.delete(user)
        db.commit()

        return {
            "success": True,
            "message": "User deleted successfully."
        }

    finally:
        db.close()