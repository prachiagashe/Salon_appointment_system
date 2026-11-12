from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr


class ContactMessageCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    subject: str
    message: str


class ContactMessageOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    subject: str
    message: str
    is_resolved: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
