'use client'

import { useState } from 'react'
import Link from 'next/link'

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '1:00 PM', '1:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM',
]

const meetingTypes = [
  { id: 'discovery', label: 'Discovery Call', duration: '15 min', desc: 'Learn about your practice and billing needs' },
  { id: 'demo', label: 'Product Demo', duration: '30 min', desc: 'See MedCloud and our AI agents in action' },
  { id: 'proposal', label: 'Revenue Analysis Review', duration: '45 min', desc: 'Walk through your custom revenue analysis' },
]

function getNextWeekdays(count: number): Date[] {
  const days: Date[] = []
  const d = new Date()
  d.setDate(d.getDate() + 1)
  while (days.length < count) {
    if (d.getDay() !== 0 && d.getDay() !== 6) days.push(new Date(d))
    d.setDate(d.getDate() + 1)
  }
  return days
}

export default function BookingPage() {
  const [step, setStep] = useState(1)
  const [meetingType, setMeetingType] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', practice: '', specialty: '' })
  const [booked, setBooked] = useState(false)

  const dates = getNextWeekdays(10)

  const handleBook = async () => {
    if (!selectedDate || !selectedTime || !formData.name || !formData.email) return

    const dateStr = selectedDate.toISOString().split('T')[0]
    const [time, period] = selectedTime.split(' ')
    const [hrs, mins] = time.split(':')
    let hour = parseInt(hrs)
    if (period === 'PM' && hour !== 12) hour += 12
    if (period === 'AM' && hour === 12) hour = 0
    const scheduledAt = `${dateStr}T${hour.toString().padStart(2, '0')}:${mins}:00`

    // Create lead via API
    const nameParts = formData.name.split(' ')
    await fetch('/api/crm/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        first_name: nameParts[0],
        last_name: nameParts.slice(1).join(' ') || 'Unknown',
        email: formData.email,
        phone: formData.phone,
        practice_name: formData.practice,
        specialty: formData.specialty || 'other',
        source: 'contact_form',
        notes: `Booked ${meetingType} call for ${selectedDate.toLocaleDateString()} at ${selectedTime}`,
      }),
    })

    setBooked(true)
  }

  if (booked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fb', fontFamily: "'Reddit Sans', sans-serif" }}>
        <div style={{ maxWidth: 500, textAlign: 'center', padding: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#00B5D6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 300, margin: '0 0 12px' }}>You&apos;re Booked!</h1>
          <p style={{ fontSize: 16, color: '#000000', margin: '0 0 8px' }}>
            {meetingTypes.find(m => m.id === meetingType)?.label} · {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
          </p>
          <p style={{ fontSize: 14, color: '#000000', marginBottom: 32 }}>Check your email for a calendar invite and confirmation.</p>
          <Link href="/" style={{ color: '#00B5D6', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>← Back to Cosentus.com</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fb', fontFamily: "'Reddit Sans', sans-serif" }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '60px 20px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <img src="/images/cosentus-logo.png" alt="Cosentus" style={{ height: 32, marginBottom: 16 }} />
          <h1 style={{ fontSize: 32, fontWeight: 300, color: '#000', margin: '0 0 8px' }}>Schedule a Call</h1>
          <p style={{ fontSize: 16, color: '#000000', margin: 0 }}>Pick a time that works. No pressure. Just data.</p>
        </div>

        {/* Steps */}
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 32 }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{ width: s === step ? 32 : 8, height: 8, borderRadius: 4, background: s <= step ? '#00B5D6' : '#E6E6E6', transition: 'all 0.3s' }} />
          ))}
        </div>

        {/* Step 1: Meeting type */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {meetingTypes.map(t => (
              <button key={t.id} onClick={() => { setMeetingType(t.id); setStep(2) }} style={{
                background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: '24px',
                cursor: 'pointer', textAlign: 'left', transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#00B5D6' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#E6E6E6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#000' }}>{t.label}</div>
                    <div style={{ fontSize: 14, color: '#000000', marginTop: 4 }}>{t.desc}</div>
                  </div>
                  <span style={{ fontSize: 13, color: '#00B5D6', fontWeight: 500, whiteSpace: 'nowrap' }}>{t.duration}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 2: Date + Time */}
        {step === 2 && (
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>Pick a Date</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {dates.map(d => {
                const isSelected = selectedDate?.toDateString() === d.toDateString()
                return (
                  <button key={d.toISOString()} onClick={() => setSelectedDate(d)} style={{
                    padding: '12px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: isSelected ? '#00B5D6' : '#F5F5F5', color: isSelected ? 'white' : '#000',
                    fontSize: 13, fontWeight: isSelected ? 600 : 400, minWidth: 80, textAlign: 'center',
                  }}>
                    <div style={{ fontSize: 11, color: isSelected ? 'rgba(255,255,255,0.7)' : '#616161' }}>{d.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                    <div style={{ marginTop: 2 }}>{d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  </button>
                )
              })}
            </div>

            {selectedDate && (
              <>
                <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>Pick a Time</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                  {timeSlots.map(t => (
                    <button key={t} onClick={() => { setSelectedTime(t); setStep(3) }} style={{
                      padding: '10px', borderRadius: 6, border: 'none', cursor: 'pointer',
                      background: selectedTime === t ? '#00B5D6' : '#F5F5F5',
                      color: selectedTime === t ? 'white' : '#000', fontSize: 13,
                    }}>{t}</button>
                  ))}
                </div>
              </>
            )}

            <button onClick={() => setStep(1)} style={{ marginTop: 16, background: 'none', border: 'none', color: '#000000', fontSize: 13, cursor: 'pointer' }}>← Back</button>
          </div>
        )}

        {/* Step 3: Contact info */}
        {step === 3 && (
          <div style={{ background: 'white', borderRadius: 12, border: '1px solid #E6E6E6', padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 4px' }}>Almost Done</h3>
            <p style={{ fontSize: 13, color: '#000000', marginBottom: 20 }}>
              {meetingTypes.find(m => m.id === meetingType)?.label} · {selectedDate?.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedTime}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Your name *" required
                style={{ padding: '12px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 14 }} />
              <input value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="Email *" type="email" required
                style={{ padding: '12px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 14 }} />
              <input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} placeholder="Phone"
                style={{ padding: '12px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 14 }} />
              <input value={formData.practice} onChange={e => setFormData({ ...formData, practice: e.target.value })} placeholder="Practice name"
                style={{ padding: '12px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 14 }} />
              <select value={formData.specialty} onChange={e => setFormData({ ...formData, specialty: e.target.value })}
                style={{ padding: '12px 14px', borderRadius: 6, border: '1px solid #E6E6E6', fontSize: 14, background: 'white', color: formData.specialty ? '#000' : '#616161' }}>
                <option value="">Select specialty...</option>
                <option value="anesthesia">Anesthesia</option>
                <option value="orthopedics">Orthopedics</option>
                <option value="pain_management">Pain Management</option>
                <option value="asc">ASC</option>
                <option value="behavioral_health">Behavioral Health</option>
                <option value="urgent_care">Urgent Care</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
              <button onClick={handleBook} disabled={!formData.name || !formData.email} style={{
                background: '#00B5D6', color: 'white', border: 'none', borderRadius: 8,
                padding: '14px 32px', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                opacity: (!formData.name || !formData.email) ? 0.5 : 1,
              }}>Book Meeting</button>
              <button onClick={() => setStep(2)} style={{ background: 'none', border: '1px solid #E6E6E6', borderRadius: 8, padding: '14px 20px', fontSize: 13, cursor: 'pointer', color: '#000000' }}>← Back</button>
            </div>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 40, fontSize: 12, color: '#000000' }}>
          Cosentus · (877) 806-2286 · cosentus.com
        </div>
      </div>
    </div>
  )
}
