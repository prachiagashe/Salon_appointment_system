// Zero-dependency notification chime using the Web Audio API.
// Plays a soft two-tone "luxury salon" chime: E5 -> B5 with a gentle
// triangle-wave attack and smooth exponential fade-out.

let audioCtx = null
let muted = false

export function setNotificationMuted(value) {
  muted = value
}

export function isNotificationMuted() {
  return muted
}

function getAudioContext() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext
    if (!Ctx) return null
    audioCtx = new Ctx()
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {})
  }
  return audioCtx
}

function playTone(ctx, freq, startTime, duration, peakGain = 0.18) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(freq, startTime)

  // Smooth attack + exponential fade-out
  gain.gain.setValueAtTime(0.0001, startTime)
  gain.gain.exponentialRampToValueAtTime(peakGain, startTime + 0.03)
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

  osc.connect(gain)
  gain.connect(ctx.destination)

  osc.start(startTime)
  osc.stop(startTime + duration + 0.05)
}

export function playNotificationChime() {
  if (muted) return
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime
    // E5 (659.25 Hz) -> B5 (987.77 Hz), staggered for a pleasant two-tone chime
    playTone(ctx, 659.25, now, 0.55, 0.16)
    playTone(ctx, 987.77, now + 0.18, 0.7, 0.14)
  } catch (err) {
    // Audio failures must never break the UI
    console.warn('Notification chime failed:', err)
  }
}

// Call this on any user interaction (click/keydown) to satisfy browser
// autoplay policies so the chime can play later without a gesture.
export function unlockAudioContext() {
  getAudioContext()
}
