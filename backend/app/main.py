from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password
from app.database import Base, SessionLocal, engine
from app.models.user import User
from app.models.service import Service
from app.routers import admin, appointments, auth, contact, services

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

DEFAULT_SERVICES = [
    {
        "name": "Signature Haircut",
        "category": "Hair Care",
        "description": "Precision cut and styling tailored to your face shape, finished with a wash and blow-dry.",
        "price": 50.00,
        "duration_minutes": 45,
        "image_url": "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
    },
    {
        "name": "Hair Coloring",
        "category": "Hair Care",
        "description": "Premium hair coloring using high-quality products for vibrant, long-lasting results.",
        "price": 120.00,
        "duration_minutes": 120,
        "image_url": "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop",
    },
    {
        "name": "Bridal Styling",
        "category": "Makeup & Bridal",
        "description": "Complete bridal package including consultation, trial, and day-of hair and makeup.",
        "price": 250.00,
        "duration_minutes": 150,
        "image_url": "https://images.unsplash.com/photo-1457972729786-0411a7b2b426?w=600&h=400&fit=crop",
    },
    {
        "name": "Hydrating Facial",
        "category": "Skin Care",
        "description": "Deep cleansing and hydrating facial to refresh and rejuvenate your skin.",
        "price": 60.00,
        "duration_minutes": 45,
        "image_url": "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop",
    },
    {
        "name": "Manicure & Pedicure",
        "category": "Nail Care",
        "description": "Complete nail care for hands and feet including shaping, cuticle care, and polish.",
        "price": 80.00,
        "duration_minutes": 90,
        "image_url": "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop",
    },
]


def migrate_services_table(db: Session) -> None:
    """Rename legacy service columns to the new schema if they still exist."""
    cols = {row[0] for row in db.execute(text("SHOW COLUMNS FROM services"))}
    if "duration" in cols and "duration_minutes" not in cols:
        db.execute(text("ALTER TABLE services CHANGE duration duration_minutes INT NULL"))
    if "image" in cols and "image_url" not in cols:
        db.execute(text("ALTER TABLE services CHANGE image image_url VARCHAR(500) NULL"))
    if "updated_at" not in cols:
        db.execute(text("ALTER TABLE services ADD COLUMN updated_at DATETIME NULL"))
    db.commit()


def seed_services(db: Session) -> None:
    """Seed default salon services when the table is empty."""
    if db.query(Service).count() == 0:
        for s in DEFAULT_SERVICES:
            db.add(Service(**s, is_active=True))
        db.commit()


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
        migrate_services_table(db)
        seed_services(db)
        enforce_roles(db)
    finally:
        db.close()

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(appointments.router, prefix="/api/appointments", tags=["appointments"])
app.include_router(contact.router, prefix="/api/contact", tags=["contact"])
app.include_router(services.router, prefix="/api/services", tags=["services"])

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
