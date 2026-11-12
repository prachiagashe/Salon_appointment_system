from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship

from app.database import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    customer_name = Column(String(100), nullable=False)
    customer_email = Column(String(150), nullable=True)
    phone = Column(String(20), nullable=True)
    service_name = Column(String(150), nullable=False)
    staff_name = Column(String(100), nullable=False)
    appointment_date = Column(String(20), nullable=False)
    appointment_time = Column(String(20), nullable=False)
    notes = Column(Text, nullable=True)
    status = Column(String(30), nullable=False, default="Confirmed")
    created_at = Column(DateTime, server_default=func.now())

    user = relationship("User", backref="appointments")
