from datetime import date
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.deps import require_admin
from app.database import get_db
from app.models.appointment import Appointment
from app.models.contact import ContactMessage
from app.models.service import Service
from app.models.staff import Staff
from app.models.user import User
from app.schemas.appointment import AppointmentOut
from app.schemas.service import ServiceCreate, ServiceOut, ServiceUpdate
from app.schemas.staff import StaffCreate, StaffOut, StaffUpdate
from app.schemas.user import UserOut

router = APIRouter()


# ---------- Schemas ----------

class AdminStats(BaseModel):
    total_appointments: int
    today_appointments: int
    upcoming_appointments: int
    pending_appointments: int
    total_users: int
    total_services: int
    total_staff: int
    unread_inquiries: int


class AppointmentStatusUpdate(BaseModel):
    status: str


class UserRoleUpdate(BaseModel):
    role: Optional[str] = None
    is_active: Optional[bool] = None


# ---------- Dashboard ----------

@router.get("/stats", response_model=AdminStats)
def get_stats(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    today = date.today().isoformat()
    upcoming = (
        db.query(Appointment)
        .filter(Appointment.appointment_date >= today, Appointment.status.in_(["Confirmed", "Pending"]))
        .count()
    )
    return AdminStats(
        total_appointments=db.query(Appointment).count(),
        today_appointments=db.query(Appointment).filter(Appointment.appointment_date == today).count(),
        upcoming_appointments=upcoming,
        pending_appointments=db.query(Appointment).filter(Appointment.status == "Pending").count(),
        total_users=db.query(User).count(),
        total_services=db.query(Service).count(),
        total_staff=db.query(Staff).count(),
        unread_inquiries=db.query(ContactMessage).filter(ContactMessage.is_resolved == False).count(),  # noqa: E712
    )


# ---------- Appointments ----------

@router.get("/appointments", response_model=List[AppointmentOut])
def list_all_appointments(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return (
        db.query(Appointment)
        .order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc())
        .all()
    )


@router.put("/appointments/{appointment_id}/status", response_model=AppointmentOut)
def update_appointment_status(
    appointment_id: int,
    data: AppointmentStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    allowed = {"Pending", "Confirmed", "Completed", "Cancelled"}
    if data.status not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Status must be one of {sorted(allowed)}.",
        )
    appointment = db.query(Appointment).filter(Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Appointment not found.")
    appointment.status = data.status
    db.commit()
    db.refresh(appointment)
    return appointment


# ---------- Users ----------

@router.get("/users", response_model=List[UserOut])
def list_users(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return db.query(User).order_by(User.created_at.desc()).all()


@router.put("/users/{user_id}", response_model=UserOut)
def update_user(
    user_id: int,
    data: UserRoleUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    if data.role is not None:
        if data.role not in ("admin", "customer"):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role.")
        if user.id == admin.id and data.role != "admin":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot remove your own admin role.")
        user.role = data.role
    if data.is_active is not None:
        if user.id == admin.id and not data.is_active:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You cannot deactivate your own account.")
        user.is_active = data.is_active
    db.commit()
    db.refresh(user)
    return user


# ---------- Services ----------

@router.get("/services", response_model=List[ServiceOut])
def list_services(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return db.query(Service).order_by(Service.id).all()


@router.post("/services", response_model=ServiceOut, status_code=status.HTTP_201_CREATED)
def create_service(
    data: ServiceCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = Service(**data.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.put("/services/{service_id}", response_model=ServiceOut)
def update_service(
    service_id: int,
    data: ServiceUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(service, field, value)
    db.commit()
    db.refresh(service)
    return service


@router.delete("/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found.")
    db.delete(service)
    db.commit()


# ---------- Staff ----------

@router.get("/staff", response_model=List[StaffOut])
def list_staff(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    return db.query(Staff).order_by(Staff.id).all()


@router.post("/staff", response_model=StaffOut, status_code=status.HTTP_201_CREATED)
def create_staff(
    data: StaffCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    member = Staff(**data.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


@router.put("/staff/{staff_id}", response_model=StaffOut)
def update_staff(
    staff_id: int,
    data: StaffUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    member = db.query(Staff).filter(Staff.id == staff_id).first()
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff member not found.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(member, field, value)
    db.commit()
    db.refresh(member)
    return member


@router.delete("/staff/{staff_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_staff(
    staff_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    member = db.query(Staff).filter(Staff.id == staff_id).first()
    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Staff member not found.")
    db.delete(member)
    db.commit()
