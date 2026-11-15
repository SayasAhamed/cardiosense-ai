from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.user import User
from app.models.password_reset import PasswordResetToken

from app.schemas.password_reset_schema import (
    ForgotPasswordRequest,
    VerifyOTPRequest,
    ResetPasswordRequest,
    PasswordResetResponse
)

from app.auth.otp_handler import (
    generate_otp,
    generate_expiry,
    is_otp_expired
)

from app.auth.security import hash_password

router = APIRouter(
    prefix="/auth",
    tags=["Password Reset"]
)

# ==========================================
# DATABASE SESSION
# ==========================================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==========================================
# STEP 1 — REQUEST OTP
# ==========================================

@router.post(
    "/forgot-password",
    response_model=PasswordResetResponse
)
def forgot_password(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    email = request.email.strip().lower()

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="Email is not registered."
        )

    # Remove previous OTPs
    db.query(PasswordResetToken).filter(
        PasswordResetToken.email == email
    ).delete()

    otp = generate_otp()
    expiry = generate_expiry()

    otp_record = PasswordResetToken(
        user_id=user.id,
        email=email,
        otp_code=otp,
        expires_at=expiry,
        verified=False
    )

    db.add(otp_record)
    db.commit()

    # Demo project (later replace with Gmail SMTP)
    print("\n====================================")
    print("CardioSense Password Reset OTP")
    print(f"Email : {email}")
    print(f"OTP   : {otp}")
    print(f"Valid Until : {expiry}")
    print("====================================\n")

    return PasswordResetResponse(
        success=True,
        message="OTP generated successfully."
    )


# ==========================================
# STEP 2 — VERIFY OTP
# ==========================================

@router.post(
    "/verify-otp",
    response_model=PasswordResetResponse
)
def verify_otp(
    request: VerifyOTPRequest,
    db: Session = Depends(get_db)
):
    email = request.email.strip().lower()

    otp_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.email == email,
        PasswordResetToken.otp_code == request.otp
    ).first()

    if not otp_record:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP."
        )

    if is_otp_expired(otp_record.expires_at):
        db.delete(otp_record)
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="OTP has expired."
        )

    otp_record.verified = True
    db.commit()

    return PasswordResetResponse(
        success=True,
        message="OTP verified successfully."
    )


# ==========================================
# STEP 3 — RESET PASSWORD
# ==========================================

@router.post(
    "/reset-password",
    response_model=PasswordResetResponse
)
def reset_password(
    request: ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    email = request.email.strip().lower()

    if request.new_password != request.confirm_password:
        raise HTTPException(
            status_code=400,
            detail="Passwords do not match."
        )

    otp_record = db.query(PasswordResetToken).filter(
        PasswordResetToken.email == email,
        PasswordResetToken.otp_code == request.otp,
        PasswordResetToken.verified == True
    ).first()

    if not otp_record:
        raise HTTPException(
            status_code=400,
            detail="OTP verification required."
        )

    if is_otp_expired(otp_record.expires_at):
        db.delete(otp_record)
        db.commit()

        raise HTTPException(
            status_code=400,
            detail="OTP has expired."
        )

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found."
        )

    # Update password hash
    user.hashed_password = hash_password(request.new_password)
    db.commit()

    # Delete OTP after successful reset
    db.delete(otp_record)
    db.commit()

    return PasswordResetResponse(
        success=True,
        message="Password reset successful."
    )


# ==========================================
# STEP 4 — RESEND OTP
# ==========================================

@router.post(
    "/resend-otp",
    response_model=PasswordResetResponse
)
def resend_otp(
    request: ForgotPasswordRequest,
    db: Session = Depends(get_db)
):
    # Generates a fresh OTP and replaces the old one.
    return forgot_password(request, db)