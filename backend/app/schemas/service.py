from typing import Optional

from pydantic import BaseModel


class ServiceBase(BaseModel):
    name: str
    category: Optional[str] = "General"
    description: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[str] = None
    image: Optional[str] = None
    is_active: Optional[int] = 1


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[str] = None
    image: Optional[str] = None
    is_active: Optional[int] = None


class ServiceOut(ServiceBase):
    id: int

    class Config:
        from_attributes = True
