from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.routers import appointments

# Import models so SQLAlchemy metadata is fully registered
from app.models import appointment as _appointment  # noqa: F401
from app.models import user as _user  # noqa: F401

app = FastAPI(title="SalonEase API", version="1.0.0")

app.include_router(appointments.router, prefix="/api/appointments", tags=["appointments"])

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to SalonEase API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}
