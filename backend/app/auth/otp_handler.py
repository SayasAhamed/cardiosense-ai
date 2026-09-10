import random
from datetime import datetime, timedelta


# ==========================================
# OTP CONFIGURATION
# ==========================================

OTP_LENGTH = 6
OTP_EXPIRE_MINUTES = 2


# ==========================================
# GENERATE RANDOM OTP
# ==========================================

def generate_otp():
    """
    Generates a secure random 6-digit OTP.
    Example: 483921
    """
    return "".join(random.choices("0123456789", k=OTP_LENGTH))


# ==========================================
# OTP EXPIRY TIME
# ==========================================

def generate_expiry():
    """
    Returns OTP expiry timestamp.
    Default expiry = 2 minutes.
    """
    return datetime.utcnow() + timedelta(minutes=OTP_EXPIRE_MINUTES)


# ==========================================
# CHECK OTP EXPIRATION
# ==========================================

def is_otp_expired(expiry_time):
    """
    Returns True if OTP is expired.
    """
    return datetime.utcnow() > expiry_time