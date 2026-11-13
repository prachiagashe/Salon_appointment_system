from sqlalchemy import Column, DateTime, Integer, String, Text, func

from app.database import Base


class Staff(Base):
    __tablename__ = "staff"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    title = Column(String(100), nullable=True)
    specialization = Column(String(100), nullable=True)
    bio = Column(Text, nullable=True)
    image = Column(String(500), nullable=True)
    availability = Column(String(50), nullable=False, default="Available")
    is_active = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, server_default=func.now())
