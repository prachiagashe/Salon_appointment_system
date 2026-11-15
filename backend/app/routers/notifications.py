from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.deps import require_admin
from app.database import get_db
from app.models.notification import AdminNotification
from app.models.user import User

router = APIRouter()


class NotificationOut(BaseModel):
    id: int
    appointment_id: int | None = None
    title: str
    message: str
    is_read: bool
    created_at: str | None = None

    class Config:
        from_attributes = True


class NotificationListResponse(BaseModel):
    notifications: List[NotificationOut]
    unread_count: int


def _serialize(n: AdminNotification) -> NotificationOut:
    return NotificationOut(
        id=n.id,
        appointment_id=n.appointment_id,
        title=n.title,
        message=n.message,
        is_read=bool(n.is_read),
        created_at=n.created_at.isoformat() if n.created_at else None,
    )


@router.get("", response_model=NotificationListResponse)
def list_notifications(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    notifications = (
        db.query(AdminNotification)
        .order_by(AdminNotification.created_at.desc(), AdminNotification.id.desc())
        .limit(20)
        .all()
    )
    unread_count = (
        db.query(AdminNotification)
        .filter(AdminNotification.is_read == False)  # noqa: E712
        .count()
    )
    return NotificationListResponse(
        notifications=[_serialize(n) for n in notifications],
        unread_count=unread_count,
    )


@router.put("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    db.query(AdminNotification).filter(AdminNotification.is_read == False).update(  # noqa: E712
        {AdminNotification.is_read: True}, synchronize_session=False
    )
    db.commit()
    return {"success": True}


@router.put("/{notification_id}/read")
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    notification = (
        db.query(AdminNotification)
        .filter(AdminNotification.id == notification_id)
        .first()
    )
    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found.",
        )
    notification.is_read = True
    db.commit()
    return {"success": True}
