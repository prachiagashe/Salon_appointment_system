from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


class AppointmentCreate(BaseModel):
    service_name: str
    staff_name: str
    appointment_date: str
    appointment_time: str
    customer_name: Optional[str] = None
    customer_email: Optional[EmailStr] = None
    phone: Optional[str] = None
    notes: Optional[str] = None


class AppointmentOut(BaseModel):
    id: int
    user_id: Optional[int] = None
    customer_name: str
    customer_email: Optional[str] = None
    phone: Optional[str] = None
    service_name: str
    staff_name: str
    appointment_date: str
    appointment_time: str
    notes: Optional[str] = None
    status: str
    cancellation_reason: Optional[str] = None
    price: Optional[float] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AppointmentCancel(BaseModel):
    status: Optional[str] = None
    cancellation_reason: str = Field(min_length=5, max_length=255)
