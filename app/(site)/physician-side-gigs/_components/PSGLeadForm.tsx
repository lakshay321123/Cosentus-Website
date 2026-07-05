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
 */

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  border: '1px solid var(--gray-200)',
  borderRadius: 'var(--radius-sm)',
  fontSize: 15,
  fontFamily: 'var(--font-body)',
  outline: 'none',
  transition: 'border-color var(--transition-fast)',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 400,
  color: 'var(--gray-700)',
  marginBottom: 6,
}

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(false)
    try {
      const notes = [
        'Physician Side Gigs landing page',
        formData.referralCode ? `Referral Code: ${formData.referralCode}` : '',
        formData.state ? `State: ${formData.state}` : '',
      ]
        .filter(Boolean)
        .join(' | ')

      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: formData.firstName.trim() || 'Unknown',
          last_name: formData.lastName.trim() || 'Unknown',
          email: formData.email,
          phone: formData.phone,
          practice_name: formData.companyName,
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
    }
    setSubmitting(false)
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
      {[
        { name: 'firstName', label: 'First Name', type: 'text', required: true },
        { name: 'lastName', label: 'Last Name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        { name: 'phone', label: 'Phone', type: 'tel', required: true },
        { name: 'referralCode', label: 'Referral Code', type: 'text', required: false, placeholder: 'PSG5OFF' },
        { name: 'companyName', label: 'Company Name', type: 'text', required: true },
        { name: 'state', label: 'State', type: 'text', required: true },
      ].map((field) => (
        <div key={field.name}>
          <label style={labelStyle}>{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleChange}
            required={field.required}
            placeholder={field.placeholder}
            style={inputStyle}
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
