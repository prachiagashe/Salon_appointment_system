from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.database import Base, SessionLocal, engine
from app.models.user import User
from app.routers import admin, appointments, auth, contact

# Import models so SQLAlchemy metadata is fully registered
from app.models import appointment as _appointment  # noqa: F401
from app.models import contact as _contact  # noqa: F401
from app.models import service as _service  # noqa: F401
from app.models import staff as _staff  # noqa: F401
from app.models import user as _user  # noqa: F401

# Create tables if they don't exist yet
Base.metadata.create_all(bind=engine)

ADMIN_EMAIL = "admin@gmail.com"
ADMIN_PASSWORD = "12345678"


def enforce_roles(db: Session) -> None:
    """Guarantee only admin@gmail.com has the admin role; everyone else is a customer."""
    admin_user = db.query(User).filter(User.email == ADMIN_EMAIL).first()
    if not admin_user:
        db.add(
            User(
                full_name="Salon Admin",
                email=ADMIN_EMAIL,
                phone=None,
                hashed_password=hash_password(ADMIN_PASSWORD),
                role="admin",
                is_active=True,
            )
        )
        db.commit()
    elif admin_user.role != "admin" or not admin_user.is_active:
        admin_user.role = "admin"
        admin_user.is_active = True
        db.commit()

    # Demote every other account to customer (fixes stale/incorrect roles)
    others = db.query(User).filter(User.email != ADMIN_EMAIL, User.role != "customer").all()
    for u in others:
        u.role = "customer"
    if others:
        db.commit()


app = FastAPI(title="SalonEase API", version="1.0.0")


@app.on_event("startup")
def on_startup() -> None:
    db = SessionLocal()
    try:
        enforce_roles(db)
    finally:
        db.close()

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["appointments"])
app.include_router(contact.router, prefix="/api/contact", tags=["contact"])

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
