from pydantic import BaseModel, EmailStr, Field


# ==========================================
# STEP 1 — SEND EMAIL
# ==========================================

class ForgotPasswordRequest(BaseModel):
    email: EmailStr


# ==========================================
# STEP 2 — VERIFY OTP
# ==========================================

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)


# ==========================================
# STEP 3 — RESET PASSWORD
# ==========================================

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    otp: str = Field(..., min_length=6, max_length=6)

    new_password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)


# ==========================================
# STANDARD RESPONSE
# ==========================================

class PasswordResetResponse(BaseModel):
    success: bool
    message: str