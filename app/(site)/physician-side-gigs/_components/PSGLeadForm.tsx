'use client'

import { useState } from 'react'

/**
 * Lead capture form for the /physician-side-gigs landing page.
 *
 * Field set differs from the generic contact LeadForm (First/Last name
 * split, Referral Code, Company Name, State — no specialty selector),
 * so this is a dedicated component rather than a LeadForm variant.
 *
 * Submits to the same /api/crm/leads endpoint as every other lead form:
 *   - source: 'contact_form' (matches the leads.source CHECK constraint)
 *   - practice_name: the Company Name field
 *   - specialty: 'other' (no selector on this page)
 *   - PSG attribution, referral code, and state are preserved in `notes`
 * Same fail-soft behavior as LeadForm: errors surface a retry message
 * with the site-wide phone number.
 *
 * All payload fields are trimmed before POSTing so the exact-match
 * duplicate detection in /api/crm/leads (email / phone /
 * practice_name+last_name) isn't defeated by stray whitespace.
 */

// Abort the lead POST if the API hangs, so `submitting` can never stay
// stuck true and permanently disable the CTA.
const SUBMIT_TIMEOUT_MS = 10000

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 400,
  color: 'var(--gray-700)',
  marginBottom: 6,
}

const FIELDS = [
  { name: 'firstName', label: 'First Name', type: 'text', required: true, autoComplete: 'given-name' },
  { name: 'lastName', label: 'Last Name', type: 'text', required: true, autoComplete: 'family-name' },
  { name: 'email', label: 'Email', type: 'email', required: true, autoComplete: 'email' },
  { name: 'phone', label: 'Phone', type: 'tel', required: true, autoComplete: 'tel' },
  { name: 'referralCode', label: 'Referral Code', type: 'text', required: false, autoComplete: 'off', placeholder: 'PSG5OFF' },
  { name: 'companyName', label: 'Company Name', type: 'text', required: true, autoComplete: 'organization' },
  { name: 'state', label: 'State', type: 'text', required: true, autoComplete: 'address-level1' },
] as const

export default function PSGLeadForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    referralCode: '',
    companyName: '',
    state: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)
  // Name of the field currently holding keyboard focus. Drives the
  // visible focus indicator (teal border) since inputs use
  // outline: 'none' — required for keyboard accessibility.
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(false)
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT_MS)
    try {
      const referralCode = formData.referralCode.trim()
      const state = formData.state.trim()
      const notes = [
        'Physician Side Gigs landing page',
        referralCode ? `Referral Code: ${referralCode}` : '',
        state ? `State: ${state}` : '',
      ]
        .filter(Boolean)
        .join(' | ')

      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          first_name: formData.firstName.trim() || 'Unknown',
          last_name: formData.lastName.trim() || 'Unknown',
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          practice_name: formData.companyName.trim(),
          specialty: 'other',
          // Must match the leads.source CHECK constraint in the DB schema.
          // PSG attribution is preserved in `notes`.
          source: 'contact_form',
          notes,
        }),
      })
      if (!res.ok) throw new Error(`Lead submit failed: ${res.status}`)
      setSubmitted(true)
    } catch {
      setError(true)
    } finally {
      clearTimeout(timeout)
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div
        style={{
          padding: '48px 32px',
          background: 'rgba(0,181,214,0.05)',
          borderRadius: 12,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
        <h3 style={{ fontSize: 20, fontWeight: 600, color: '#000', margin: '0 0 8px' }}>
          Thank you!
        </h3>
        <p style={{ fontSize: 15, color: 'var(--gray-600)', margin: 0 }}>
          We&apos;ll be in touch within one business day to schedule your free
          revenue cycle review.
        </p>
      </div>
    )
  }

  return (
    <form
      id="psg-form"
      onSubmit={handleSubmit}
      style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
    >
      {error && (
        <div
          style={{
            padding: '14px 16px',
            background: 'rgba(220,38,38,0.06)',
            border: '1px solid rgba(220,38,38,0.3)',
            borderRadius: 8,
            color: '#b91c1c',
            fontSize: 14,
          }}
        >
          Something went wrong submitting your request. Please try again, or call
          us at (877) 806-2286.
        </div>
      )}
      {FIELDS.map((field) => (
        <div key={field.name}>
          <label htmlFor={`psg-${field.name}`} style={labelStyle}>
            {field.label}
          </label>
          <input
            id={`psg-${field.name}`}
            type={field.type}
            name={field.name}
            value={formData[field.name]}
            onChange={handleChange}
            onFocus={() => setFocusedField(field.name)}
            onBlur={() => setFocusedField(null)}
            required={field.required}
            autoComplete={field.autoComplete}
            placeholder={'placeholder' in field ? field.placeholder : undefined}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: `1px solid ${
                focusedField === field.name ? 'var(--primary)' : 'var(--gray-200)'
              }`,
              borderRadius: 'var(--radius-sm)',
              fontSize: 15,
              fontFamily: 'var(--font-body)',
              outline: 'none',
              transition: 'border-color var(--transition-fast)',
            }}
          />
        </div>
      ))}

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary"
        style={{ alignSelf: 'flex-start', opacity: submitting ? 0.7 : 1 }}
      >
        {submitting ? 'Submitting...' : 'Schedule My Review Now'}
      </button>
    </form>
  )
}
