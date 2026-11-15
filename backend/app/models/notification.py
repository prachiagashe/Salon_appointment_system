from sqlalchemy import Boolean, Column, DateTime, Integer, String, func

from app.database import Base


class AdminNotification(Base):
    __tablename__ = "admin_notifications"

    id = Column(Integer, primary_key=True, index=True)
    # Plain column (no FK) — appointments.id type varies across environments
    # and a mismatched FK crashes table creation on MySQL.
    appointment_id = Column(Integer, nullable=True)
    title = Column(String(150), nullable=False)
    message = Column(String(255), nullable=False)
    is_read = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime, server_default=func.now())
