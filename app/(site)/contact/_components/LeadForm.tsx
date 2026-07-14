'use client'

import { useState } from 'react'

interface Props {
  /**
   * Originating location slug — appended to the lead's `notes` field
   * so the sales team can route the inquiry to the correct office.
   * Optional: when omitted, the lead is treated as coming from the
   * generic /contact page.
   */
  locationSlug?: string
  /** Display name of the location, used only in the success message. */
  locationName?: string
}

/**
 * Lead capture form. Lifted out of ContactContent.tsx so the same form
 * can render on every per-location page, attributing each lead to the
 * originating office via the `location` field in the POST body.
 *
 * The submit handler is unchanged from the original ContactContent
 * implementation — same /api/crm/leads endpoint, same payload shape,
 * same fail-soft behavior (always shows success to the user).
 *
 * The DB_SPECIALTIES list mirrors the schema's enum values; values
 * outside that set get normalized to 'other' with the original label
 * preserved in the notes field.
 */
const DB_SPECIALTIES = [
  'anesthesia',
  'orthopedics',
  'pain_management',
  'asc',
  'behavioral_health',
  'urgent_care',
  'obgyn',
  'other',
]

export default function LeadForm({ locationSlug, locationName }: Props) {
  const [formData, setFormData] = useState({
    practiceName: '',
    specialty: '',
    customSpecialty: '',
    contactName: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(false)
    try {
      const nameParts = formData.contactName.trim().split(' ')
      const selectedSpecialty = formData.specialty || 'other'
      const isDbEnum = DB_SPECIALTIES.includes(selectedSpecialty)
      const actualSpecialtyLabel =
        selectedSpecialty === 'other'
          ? formData.customSpecialty || 'Other'
          : selectedSpecialty.replace(/_/g, ' ')
      const specialtyNote = !isDbEnum
        ? `Specialty: ${actualSpecialtyLabel}`
        : selectedSpecialty === 'other' && formData.customSpecialty
          ? `Specialty: ${formData.customSpecialty}`
          : ''
      const locationNote = locationSlug ? `Location: ${locationSlug}` : ''
      const notes = [
        locationNote,
        specialtyNote,
        formData.message || 'Submitted via contact form',
      ]
        .filter(Boolean)
        .join(' | ')

      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: nameParts[0] || 'Unknown',
          last_name: nameParts.slice(1).join(' ') || 'Unknown',
          email: formData.email,
          phone: formData.phone,
          practice_name: formData.practiceName,
          specialty: isDbEnum ? selectedSpecialty : 'other',
          // Must match the leads.source CHECK constraint in the DB schema.
          // Originating location is preserved in `notes` (Location: <slug>).
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
          marginTop: 32,
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
          We&apos;ll be in touch within one business day to schedule your revenue
          analysis
          {locationName ? ` from our ${locationName} team` : ''}.
        </p>
      </div>
    )
  }

  return (
    <form
      id="contact-form"
      onSubmit={handleSubmit}
      style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20 }}
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
          us at +1 (877) 266 9040.
        </div>
      )}
      {[
        { name: 'practiceName', label: 'Practice Name', type: 'text' },
        { name: 'contactName', label: 'Contact Name', type: 'text' },
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'phone', label: 'Phone', type: 'tel' },
      ].map((field) => (
        <div key={field.name}>
          <label
            style={{
              display: 'block',
              fontSize: 13,
              fontWeight: 400,
              color: 'var(--gray-700)',
              marginBottom: 6,
            }}
          >
            {field.label}
          </label>
          <input
            type={field.type}
            name={field.name}
            value={formData[field.name as keyof typeof formData]}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 15,
              fontFamily: 'var(--font-body)',
              outline: 'none',
              transition: 'border-color var(--transition-fast)',
            }}
          />
        </div>
      ))}

      <div>
        <label
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 400,
            color: 'var(--gray-700)',
            marginBottom: 6,
          }}
        >
          Specialty
        </label>
        <select
          name="specialty"
          value={formData.specialty}
          onChange={handleChange}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid var(--gray-200)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 15,
            fontFamily: 'var(--font-body)',
            outline: 'none',
            background: 'white',
          }}
        >
          <option value="">Select your specialty</option>
          <option value="allergy_immunology">Allergy &amp; Immunology</option>
          <option value="anesthesia">Anesthesia</option>
          <option value="asc">Ambulatory Surgery Center (ASC)</option>
          <option value="bariatric_surgery">Bariatric Surgery</option>
          <option value="behavioral_health">Behavioral Health</option>
          <option value="cardiology">Cardiology</option>
          <option value="cardiothoracic_surgery">Cardiothoracic Surgery</option>
          <option value="chiropractic">Chiropractic</option>
          <option value="colorectal_surgery">Colorectal Surgery</option>
          <option value="critical_care">Critical Care / Intensivist</option>
          <option value="dentistry">Dentistry</option>
          <option value="dermatology">Dermatology</option>
          <option value="dme">Durable Medical Equipment (DME)</option>
          <option value="emergency_medicine">Emergency Medicine</option>
          <option value="endocrinology">Endocrinology</option>
          <option value="endoscopy">Endoscopy</option>
          <option value="ent">ENT / Otolaryngology</option>
          <option value="family_medicine">Family Medicine</option>
          <option value="gastroenterology">Gastroenterology</option>
          <option value="general_surgery">General Surgery</option>
          <option value="geriatrics">Geriatrics</option>
          <option value="hematology_oncology">Hematology / Oncology</option>
          <option value="home_health">Home Health</option>
          <option value="hospice_palliative">Hospice &amp; Palliative Care</option>
          <option value="infectious_disease">Infectious Disease</option>
          <option value="internal_medicine">Internal Medicine</option>
          <option value="interventional_radiology">Interventional Radiology</option>
          <option value="maternal_fetal_medicine">Maternal-Fetal Medicine</option>
          <option value="nephrology">Nephrology</option>
          <option value="neurology">Neurology</option>
          <option value="neurosurgery">Neurosurgery</option>
          <option value="obgyn">OB/GYN</option>
          <option value="occupational_medicine">Occupational Medicine</option>
          <option value="ophthalmology">Ophthalmology</option>
          <option value="optometry">Optometry</option>
          <option value="oral_maxillofacial_surgery">Oral &amp; Maxillofacial Surgery</option>
          <option value="orthopedics">Orthopedics</option>
          <option value="pain_management">Pain Management</option>
          <option value="pathology">Pathology</option>
          <option value="pediatrics">Pediatrics</option>
          <option value="physical_medicine_rehab">Physical Medicine &amp; Rehabilitation</option>
          <option value="physical_therapy">Physical Therapy</option>
          <option value="plastic_surgery">Plastic Surgery</option>
          <option value="podiatry">Podiatry</option>
          <option value="primary_care">Primary Care</option>
          <option value="psychiatry">Psychiatry</option>
          <option value="pulmonology">Pulmonology</option>
          <option value="radiation_oncology">Radiation Oncology</option>
          <option value="radiology">Radiology</option>
          <option value="reproductive_endocrinology">Reproductive Endocrinology / Fertility</option>
          <option value="rheumatology">Rheumatology</option>
          <option value="sleep_medicine">Sleep Medicine</option>
          <option value="sports_medicine">Sports Medicine</option>
          <option value="substance_abuse">Substance Abuse / Addiction Medicine</option>
          <option value="urgent_care">Urgent Care</option>
          <option value="urology">Urology</option>
          <option value="vascular_surgery">Vascular Surgery</option>
          <option value="wound_care">Wound Care</option>
          <option value="other">Other</option>
        </select>
        {formData.specialty === 'other' && (
          <input
            type="text"
            name="customSpecialty"
            value={formData.customSpecialty}
            onChange={handleChange}
            placeholder="Enter your specialty"
            required
            maxLength={100}
            aria-label="Other specialty"
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid var(--gray-200)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 15,
              fontFamily: 'var(--font-body)',
              outline: 'none',
              marginTop: 10,
              transition: 'border-color var(--transition-fast)',
            }}
          />
        )}
      </div>

      <div>
        <label
          style={{
            display: 'block',
            fontSize: 13,
            fontWeight: 400,
            color: 'var(--gray-700)',
            marginBottom: 6,
          }}
        >
          Tell us a bit more (optional)
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={3}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: '1px solid var(--gray-200)',
            borderRadius: 'var(--radius-sm)',
            fontSize: 15,
            fontFamily: 'var(--font-body)',
            outline: 'none',
            resize: 'vertical',
          }}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary"
        style={{ alignSelf: 'flex-start', opacity: submitting ? 0.7 : 1 }}
      >
        {submitting ? 'Submitting...' : 'Submit Request'}
        {!submitting && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        )}
      </button>
      <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 8 }}>
        We protect client information under HIPAA and SOC 2 standards.
      </p>
    </form>
  )
}
