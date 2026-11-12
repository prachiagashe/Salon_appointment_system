from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database import get_db
from app.models.contact import ContactMessage
from app.models.user import User
from app.schemas.contact import ContactMessageCreate, ContactMessageOut

router = APIRouter()


@router.post("", response_model=ContactMessageOut, status_code=status.HTTP_201_CREATED)
def create_contact_message(
    data: ContactMessageCreate,
    db: Session = Depends(get_db),
):
    """Public endpoint — anyone can submit an inquiry."""
    message = ContactMessage(
        full_name=data.full_name.strip(),
        email=str(data.email),
        phone=data.phone,
        subject=data.subject,
        message=data.message.strip(),
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


@router.get("", response_model=List[ContactMessageOut])
def list_contact_messages(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Admin-only endpoint — salon admins can view all inquiries."""
    if not current_user or current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required.",
        )
    return db.query(ContactMessage).order_by(ContactMessage.created_at.desc()).all()
