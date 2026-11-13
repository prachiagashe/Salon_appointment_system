"""SMS / WhatsApp booking confirmation notifications via Twilio.

All senders are fire-and-forget safe: they log failures and never raise,
so a notification problem can never roll back a committed booking.
"""

import logging
import re
from typing import Optional

from app.core.config import settings

logger = logging.getLogger(__name__)

SALON_NAME = "Silken Atelier"

# Dev/test fallback: when Twilio credentials are not configured, confirmation
# messages are logged as if sent to this number instead of being skipped.
DEV_FALLBACK_PHONE = "+919356855036"


def format_phone_number(phone: Optional[str]) -> Optional[str]:
    """Normalize a phone number to E.164-ish format.

    - 10-digit numbers get the +91 country code
    - Numbers already carrying a country prefix get a leading '+' if missing
    - Returns None for empty/unusable input
    """
    if not phone:
        return None

    digits = re.sub(r"\D", "", phone)
    if not digits:
        return None

    # Strip a leading trunk prefix (e.g. 09876543210 -> 9876543210)
    if len(digits) == 11 and digits.startswith("0"):
        digits = digits[1:]

    if len(digits) == 10:
        return f"+91{digits}"

    if len(digits) == 12 and digits.startswith("91"):
        return f"+{digits}"

    # Assume it already includes a country code
    return f"+{digits}"


def _build_confirmation_message(
    customer_name: str,
    service_name: str,
    staff_name: str,
    appointment_date: str,
    appointment_time: str,
) -> str:
    return (
        f"{SALON_NAME}: Hi {customer_name}, your appointment is confirmed!\n"
        f"Service: {service_name}\n"
        f"Stylist: {staff_name}\n"
        f"Date: {appointment_date}\n"
        f"Time: {appointment_time}\n"
        f"We look forward to seeing you."
    )


def _twilio_configured() -> bool:
    return bool(
        settings.TWILIO_ACCOUNT_SID
        and settings.TWILIO_AUTH_TOKEN
        and settings.TWILIO_PHONE_NUMBER
    )


def send_booking_confirmation_sms(
    phone: Optional[str],
    customer_name: str,
    service_name: str,
    staff_name: str,
    appointment_date: str,
    appointment_time: str,
) -> None:
    """Send an SMS booking confirmation. Never raises."""
    formatted = format_phone_number(phone)
    if not formatted:
        logger.warning("No valid phone number provided; skipping SMS confirmation")
        return

    message_body = _build_confirmation_message(
        customer_name, service_name, staff_name, appointment_date, appointment_time
    )

    if not _twilio_configured():
        logger.warning(
            "Twilio credentials not configured; SMS to %s logged as sent to dev fallback %s",
            formatted,
            DEV_FALLBACK_PHONE,
        )
        logger.info("[DEV SMS -> %s]\n%s", DEV_FALLBACK_PHONE, message_body)
        return

    try:
        from twilio.rest import Client  # lazy import keeps app bootable without twilio

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            to=formatted,
            from_=settings.TWILIO_PHONE_NUMBER,
            body=message_body,
        )
        logger.info("Booking confirmation SMS sent to %s", formatted)
    except Exception:
        logger.exception("Failed to send booking confirmation SMS to %s", formatted)


def send_booking_confirmation_whatsapp(
    phone: Optional[str],
    customer_name: str,
    service_name: str,
    staff_name: str,
    appointment_date: str,
    appointment_time: str,
) -> None:
    """Send a WhatsApp booking confirmation. Never raises."""
    formatted = format_phone_number(phone)
    if not formatted:
        logger.warning("No valid phone number provided; skipping WhatsApp confirmation")
        return

    message_body = _build_confirmation_message(
        customer_name, service_name, staff_name, appointment_date, appointment_time
    )

    if not (
        settings.TWILIO_ACCOUNT_SID
        and settings.TWILIO_AUTH_TOKEN
        and settings.TWILIO_WHATSAPP_NUMBER
    ):
        logger.warning(
            "Twilio WhatsApp not configured; message to %s logged as sent to dev fallback %s",
            formatted,
            DEV_FALLBACK_PHONE,
        )
        logger.info("[DEV WhatsApp -> %s]\n%s", DEV_FALLBACK_PHONE, message_body)
        return

    try:
        from twilio.rest import Client

        client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
        client.messages.create(
            to=f"whatsapp:{formatted}",
            from_=f"whatsapp:{settings.TWILIO_WHATSAPP_NUMBER}",
            body=message_body,
        )
        logger.info("Booking confirmation WhatsApp sent to %s", formatted)
    except Exception:
        logger.exception("Failed to send booking confirmation WhatsApp to %s", formatted)
