from typing import Optional

from pydantic import BaseModel


class StaffBase(BaseModel):
    name: str
    title: Optional[str] = None
    specialization: Optional[str] = None
    bio: Optional[str] = None
    image: Optional[str] = None
    availability: Optional[str] = "Available"
    is_active: Optional[int] = 1


class StaffCreate(StaffBase):
    pass


class StaffUpdate(BaseModel):
    name: Optional[str] = None
    title: Optional[str] = None
    specialization: Optional[str] = None
    bio: Optional[str] = None
    image: Optional[str] = None
    availability: Optional[str] = None
    is_active: Optional[int] = None


class StaffOut(StaffBase):
    id: int

    class Config:
        from_attributes = True
