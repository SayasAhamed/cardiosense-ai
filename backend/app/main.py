from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from app.database import (
    engine,
    Base,
    SessionLocal
)

from app.models.user import User
from app.models.patient import Patient
from app.models.prediction import Prediction

from app.auth.security import hash_password

from app.routes.auth_routes import router as auth_router
from app.routes.login_routes import router as login_router
from app.routes.patient_routes import router as patient_router
from app.routes.prediction_routes import router as prediction_router
from app.routes.prediction_history_routes import router as prediction_history_router
from app.routes.xai_routes import router as xai_router


# ==========================================
# FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="CardioSense AI",
    version="1.0.0"
)

# ==========================================
# CORS CONFIGURATION
# ==========================================

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.asse\.devtunnels\.ms",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================
# CREATE DATABASE TABLES
# ==========================================

Base.metadata.create_all(bind=engine)

# ==========================================
# CREATE DEFAULT ADMIN
# ==========================================

db: Session = SessionLocal()

try:
    admin_exists = db.query(User).filter(
        User.email == "admin@cardiosense.ai"
    ).first()

    if not admin_exists:
        admin_user = User(
            full_name="System Admin",
            email="admin@cardiosense.ai",
            hashed_password=hash_password("admin123"),
            role="ADMIN"
        )

        db.add(admin_user)
        db.commit()

        print("✅ Default Admin Created")

finally:
    db.close()

# ==========================================
# INCLUDE ROUTES
# ==========================================

app.include_router(auth_router)
app.include_router(login_router)
app.include_router(patient_router)
app.include_router(prediction_router)
app.include_router(prediction_history_router)
app.include_router(xai_router)

# ==========================================
# VALIDATION ERROR HANDLER
# ==========================================

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
):
    print("VALIDATION ERROR:")
    print(exc.errors())

    return JSONResponse(
        status_code=422,
        content={
            "detail": exc.errors()
        }
    )

# ==========================================
# ROOT ROUTE
# ==========================================

@app.get("/")
def home():
    return {
        "message": "CardioSense AI Backend Running Successfully"
    }