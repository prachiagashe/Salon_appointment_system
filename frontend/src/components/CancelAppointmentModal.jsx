import React, { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import './CancelAppointmentModal.css'

const REASON_CHIPS = [
  'Schedule conflict',
  'Personal emergency',
  'Booked wrong date/time',
  'Other'
]

function CancelAppointmentModal({ appointment, submitting, onConfirm, onClose }) {
  const [reason, setReason] = useState('')

  useEffect(() => {
    setReason('')
  }, [appointment?.id])

  if (!appointment) return null

  const trimmed = reason.trim()
  const canSubmit = trimmed.length >= 5 && !submitting

  const handleChip = (chip) => {
    setReason((prev) => (prev.trim() === chip ? '' : chip))
  }

  return (
    <div className="cancel-modal-overlay" onClick={onClose}>
      <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cancel-modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <h3 className="cancel-modal-title">Cancel Appointment</h3>
        <p className="cancel-modal-sub">
          {appointment.service_name} with {appointment.staff_name} on{' '}
          {appointment.appointment_date} at {appointment.appointment_time}
        </p>

        <label className="cancel-modal-label">Reason for cancellation</label>
        <div className="cancel-modal-chips">
          {REASON_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              className={`cancel-modal-chip${reason.trim() === chip ? ' active' : ''}`}
              onClick={() => handleChip(chip)}
            >
              {chip}
            </button>
          ))}
        </div>
        <textarea
          className="cancel-modal-textarea"
          placeholder="Please enter your reason for cancellation"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          maxLength={255}
        />
        <p className="cancel-modal-hint">
          {trimmed.length < 5
            ? `${Math.max(0, 5 - trimmed.length)} more character${5 - trimmed.length === 1 ? '' : 's'} required`
            : 'Thank you — this helps us improve.'}
        </p>

        <div className="cancel-modal-actions">
          <button className="cancel-modal-btn secondary" onClick={onClose} disabled={submitting}>
            Keep Appointment
          </button>
          <button
            className="cancel-modal-btn danger"
            onClick={() => onConfirm(trimmed)}
            disabled={!canSubmit}
          >
            {submitting ? <Loader2 size={15} className="cancel-modal-spinner" /> : null}
            Confirm Cancellation
          </button>
        </div>
      </div>
    </div>
  )
}

export default CancelAppointmentModal
