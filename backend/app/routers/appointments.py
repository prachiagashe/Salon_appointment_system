import logging
from typing import List, Optional

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database import get_db
from app.models.appointment import Appointment
from app.models.notification import AdminNotification
from app.models.user import User
from app.schemas.appointment import AppointmentCancel, AppointmentCreate, AppointmentOut
from app.services.notification import (
    send_booking_confirmation_sms,
    send_booking_confirmation_whatsapp,
)

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("", response_model=AppointmentOut, status_code=201)
def create_appointment(
    booking_data: AppointmentCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    # Resolve recipient: explicit phone in payload wins, else the logged-in user's phone
    recipient_phone = booking_data.phone or (current_user.phone if current_user else None)

    customer_name = (
        booking_data.customer_name
        or (current_user.full_name if current_user else "Customer")
    )
    customer_email = booking_data.customer_email or (
        current_user.email if current_user else None
    )

    appointment = Appointment(
        user_id=current_user.id if current_user else None,
        customer_name=customer_name,
        customer_email=str(customer_email) if customer_email else None,
        phone=recipient_phone,
        service_name=booking_data.service_name,
        staff_name=booking_data.staff_name,
        appointment_date=booking_data.appointment_date,
        appointment_time=booking_data.appointment_time,
        notes=booking_data.notes,
        status="Confirmed",
    )
    db.add(appointment)
    db.commit()
    db.refresh(appointment)

    # Notify admins about the new booking (never break booking on failure)
    try:
        db.add(
            AdminNotification(
                appointment_id=appointment.id,
                title="New Appointment Booked",
                message=(
                    f"{customer_name} booked {booking_data.service_name} "
                    f"with {booking_data.staff_name} for "
                    f"{booking_data.appointment_date} at {booking_data.appointment_time}"
                ),
                is_read=False,
            )
        )
        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Failed to create admin notification for appointment %s", appointment.id)

    # Queue notifications AFTER commit so SMS/WhatsApp never delay the response
    # and can never roll back the booking.
    background_tasks.add_task(
        send_booking_confirmation_sms,
        recipient_phone,
        customer_name,
        booking_data.service_name,
        booking_data.staff_name,
        booking_data.appointment_date,
        booking_data.appointment_time,
    )
    background_tasks.add_task(
        send_booking_confirmation_whatsapp,
        recipient_phone,
        customer_name,
        booking_data.service_name,
        booking_data.staff_name,
        booking_data.appointment_date,
        booking_data.appointment_time,
    )

    return appointment


@router.get("/my", response_model=List[AppointmentOut])
def get_my_appointments(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """Return the authenticated user's appointments, newest first."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
        )
    return (
        db.query(Appointment)
        .filter(Appointment.user_id == current_user.id)
        .order_by(Appointment.appointment_date.desc(), Appointment.appointment_time.desc())
        .all()
    )


@router.put("/{appointment_id}/cancel", response_model=AppointmentOut)
def cancel_appointment(
    appointment_id: int,
    payload: AppointmentCancel,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user),
):
    """Cancel an upcoming appointment owned by the current user."""
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
        )

    appointment = (
        db.query(Appointment)
        .filter(Appointment.id == appointment_id, Appointment.user_id == current_user.id)
        .first()
    )
    if not appointment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Appointment not found.",
        )
    if appointment.status not in ("Confirmed", "Pending"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel an appointment with status '{appointment.status}'.",
        )

    reason = payload.cancellation_reason.strip()
    if len(reason) < 5:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Please provide a cancellation reason (at least 5 characters).",
        )

    appointment.status = "Cancelled"
    appointment.cancellation_reason = reason[:255]
    db.commit()
    db.refresh(appointment)

    # Notify admins about the cancellation (never break the response on failure)
    try:
        db.add(
            AdminNotification(
                appointment_id=appointment.id,
                title="Appointment Cancelled",
                message=(
                    f"{appointment.customer_name} cancelled their "
                    f"{appointment.service_name} appointment. Reason: {reason}"
                ),
                is_read=False,
            )
        )
        db.commit()
    except Exception:
        db.rollback()
        logger.exception("Failed to create admin notification for cancelled appointment %s", appointment.id)

    return appointment
