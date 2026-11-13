from sqlalchemy import Column, DateTime, Integer, Numeric, String, Text, func

from app.database import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    category = Column(String(100), nullable=False, default="General")
    description = Column(Text, nullable=True)
    price = Column(Numeric(10, 2), nullable=True)
    duration = Column(String(50), nullable=True)
    image = Column(String(500), nullable=True)
    is_active = Column(Integer, nullable=False, default=1)
    created_at = Column(DateTime, server_default=func.now())
