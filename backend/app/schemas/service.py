from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ServiceBase(BaseModel):
    name: str
    category: Optional[str] = "General"
    description: Optional[str] = None
    price: Optional[float] = None
    duration_minutes: Optional[int] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = True


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration_minutes: Optional[int] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None


class ServiceOut(ServiceBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
