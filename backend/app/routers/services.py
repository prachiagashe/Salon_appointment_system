from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user, require_admin
from app.database import get_db
from app.models.service import Service
from app.models.user import User
from app.schemas.service import ServiceCreate, ServiceOut, ServiceUpdate

router = APIRouter()


@router.get("", response_model=List[ServiceOut])
def list_services(
    include_inactive: bool = Query(False),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """Public: active services only. include_inactive=true requires admin."""
    if include_inactive:
        if not current_user or (current_user.role or "").lower() != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required to view inactive services.",
            )
        return db.query(Service).order_by(Service.id).all()
    return (
        db.query(Service)
        .filter(Service.is_active == True)  # noqa: E712
        .order_by(Service.category, Service.id)
        .all()
    )


@router.post("", response_model=ServiceOut, status_code=status.HTTP_201_CREATED)
def create_service(
    data: ServiceCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = Service(**data.model_dump())
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.put("/{service_id}", response_model=ServiceOut)
def update_service(
    service_id: int,
    data: ServiceUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found.")
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(service, field, value)
    db.commit()
    db.refresh(service)
    return service


@router.delete("/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_service(
    service_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found.")
    db.delete(service)
    db.commit()
