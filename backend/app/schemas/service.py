from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class ServiceBase(BaseModel):
    name: str
    category: Optional[str] = "General"
    gender_category: Optional[str] = "Unisex"
    description: Optional[str] = None
    price: Optional[float] = None
    duration_minutes: Optional[int] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = True
    discount_percent: int = 0
    offer_label: Optional[str] = None
    has_offer: bool = False
    offer_expires_at: Optional[datetime] = None


class ServiceCreate(ServiceBase):
    discount_percent: int = Field(default=0, ge=0, le=90)


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    gender_category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration_minutes: Optional[int] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    discount_percent: Optional[int] = Field(default=None, ge=0, le=90)
    offer_label: Optional[str] = None
    has_offer: Optional[bool] = None
    offer_expires_at: Optional[datetime] = None


class ServiceOut(ServiceBase):
    id: int
    is_offer_valid: bool = False
    final_price: Optional[float] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
