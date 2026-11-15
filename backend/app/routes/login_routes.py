from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user_schema import UserLogin

# Password verification
from app.auth.security import verify_password

# JWT token creation
from app.auth.jwt_handler import create_access_token

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# ==========================================
# LOGIN
# ==========================================

@router.post("/login")
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db)
):
    # Find user by email
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    # Verify hashed password
    if not verify_password(
        user.password,
        existing_user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Email or Password"
        )

    # Generate JWT token
    access_token = create_access_token(
        {
            "sub": existing_user.email,
            "role": existing_user.role
        }
    )

    return {
        "message": "Login Successful",
        "access_token": access_token,
        "token_type": "bearer",
        "role": existing_user.role,
        "full_name": existing_user.full_name,
        "email": existing_user.email
    }