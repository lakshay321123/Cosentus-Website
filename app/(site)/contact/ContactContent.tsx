'use client'

import { useState } from 'react'
import Image from 'next/image'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

const steps = [
  { num: '1', text: 'We respond within one business day.' },
  { num: '2', text: 'We schedule a brief discovery call to understand your specialty, payer mix, and revenue performance.' },
  { num: '3', text: 'We deliver a complimentary Revenue Analysis showing exactly where revenue is leaking and how much could be recovered.' },
  { num: '4', text: 'You decide if Cosentus is the right partner — no commitment required.' },
]

export default function ContactContent() {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const DB_SPECIALTIES = ['anesthesia', 'orthopedics', 'pain_management', 'asc', 'behavioral_health', 'urgent_care', 'obgyn', 'other']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const nameParts = formData.contactName.trim().split(' ')
      const selectedSpecialty = formData.specialty || 'other'
      const isDbEnum = DB_SPECIALTIES.includes(selectedSpecialty)
      const actualSpecialtyLabel = selectedSpecialty === 'other'
        ? (formData.customSpecialty || 'Other')
        : selectedSpecialty.replace(/_/g, ' ')
      const specialtyNote = !isDbEnum ? `Specialty: ${actualSpecialtyLabel}` : (selectedSpecialty === 'other' && formData.customSpecialty ? `Specialty: ${formData.customSpecialty}` : '')
      const notes = [specialtyNote, formData.message || 'Submitted via contact form'].filter(Boolean).join(' | ')

      await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          first_name: nameParts[0] || 'Unknown',
          last_name: nameParts.slice(1).join(' ') || 'Unknown',
          email: formData.email,
          phone: formData.phone,
          practice_name: formData.practiceName,
          specialty: isDbEnum ? selectedSpecialty : 'other',
          source: 'contact_form',
          notes,
        }),
      })
      setSubmitted(true)
    } catch {
      setSubmitted(true) // still show success to user
    }
    setSubmitting(false)
  }

  return (
    <>
      {/* Contact Form + Details */}
      <section id="contact-form" className="section section-alt">
        <div className="container">
          <div className="ra-main-grid" style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 80,
            alignItems: 'start',
          }}>
            {/* Form */}
            <RevealOnScroll>
              <div>
                <div className="section-label">GET IN TOUCH</div>
                <div className="section-title" style={{ fontSize: 32 }}>Request Your Free Revenue Analysis</div>
                {submitted ? (
                  <div style={{ marginTop: 32, padding: '48px 32px', background: 'rgba(0,181,214,0.05)', borderRadius: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
                    <h3 style={{ fontSize: 20, fontWeight: 600, color: '#000', margin: '0 0 8px' }}>Thank you!</h3>
                    <p style={{ fontSize: 15, color: 'var(--gray-600)', margin: 0 }}>We&apos;ll be in touch within one business day to schedule your revenue analysis.</p>
                  </div>
                ) : (
                <form onSubmit={handleSubmit} style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {[
                    { name: 'practiceName', label: 'Practice Name', type: 'text' },
                    { name: 'contactName', label: 'Contact Name', type: 'text' },
                    { name: 'email', label: 'Email', type: 'email' },
                    { name: 'phone', label: 'Phone', type: 'tel' },
                  ].map((field) => (
                    <div key={field.name}>
                      <label style={{ display: 'block', fontSize: 13, fontWeight: 400, color: 'var(--gray-700)', marginBottom: 6 }}>
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
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 400, color: 'var(--gray-700)', marginBottom: 6 }}>
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
                      <option value="allergy_immunology">Allergy & Immunology</option>
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
                      <option value="hospice_palliative">Hospice & Palliative Care</option>
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
                      <option value="oral_maxillofacial_surgery">Oral & Maxillofacial Surgery</option>
                      <option value="orthopedics">Orthopedics</option>
                      <option value="pain_management">Pain Management</option>
                      <option value="pathology">Pathology</option>
                      <option value="pediatrics">Pediatrics</option>
                      <option value="physical_medicine_rehab">Physical Medicine & Rehabilitation</option>
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
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 400, color: 'var(--gray-700)', marginBottom: 6 }}>
                      Message (Optional)
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
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
                  <button type="submit" disabled={submitting} className="btn-primary" style={{ alignSelf: 'flex-start', opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? 'Submitting...' : 'Submit Request'}
                    {!submitting && <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>}
                  </button>
                  <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 8 }}>
                    We protect client information under HIPAA and SOC 2 standards.
                  </p>
                </form>
                )}
              </div>
            </RevealOnScroll>

            {/* Contact Details */}
            <RevealOnScroll delay={0.2}>
              <div style={{ paddingTop: 60 }}>
                <div style={{ marginBottom: 40 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 400, color: 'var(--gray-900)', marginBottom: 24 }}>Contact Details</h3>
                  {[
                    { label: 'Phone', value: '(877) 806-2286', href: 'tel:8778062286' },
                    { label: 'Email', value: 'sales@cosentus.com', href: 'mailto:sales@cosentus.com' },
                    { label: 'Headquarters', value: 'Irvine, California', href: null },
                    { label: 'Hours', value: 'Monday–Friday, 9am–5pm (all time zones)', href: null },
                  ].map((item, i) => (
                    <div key={i} style={{ marginBottom: 20 }}>
                      <div style={{ fontSize: 12, fontWeight: 400, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
                        {item.label}
                      </div>
                      {item.href ? (
                        <a href={item.href} style={{ fontSize: 17, color: 'var(--primary)', fontWeight: 400 }}>
                          {item.value}
                        </a>
                      ) : (
                        <div style={{ fontSize: 17, color: 'var(--gray-800)', fontWeight: 400 }}>{item.value}</div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Trust Badges */}
                <div style={{
                  padding: 32,
                  background: 'var(--primary)',
                  borderRadius: 'var(--radius-md)',
                  color: 'white',
                }}>
                  <h4 style={{ fontSize: 16, fontWeight: 400, marginBottom: 12, color: 'rgba(255,255,255,0.8)' }}>Trusted & Certified</h4>
                  <Image
                    src="/all-accolades.png"
                    alt="Cosentus Accolades — 25 Years of Excellence, AICPA SOC 2, Inc. 5000, HIPAA Seal of Compliance, HIPAA Verified, HBMA Member 2024"
                    width={1687}
                    height={259}
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    style={{ mixBlendMode: 'screen', width: '100%', height: 'auto', display: 'block' }}
                  />
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">WHAT HAPPENS NEXT</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">What Happens After You Reach Out</div>
          </RevealOnScroll>
          <div className="steps-desktop" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 24,
            marginTop: 48,
          }}>
            {steps.map((step, i) => (
              <RevealOnScroll key={i} delay={i * 0.1}>
                <div style={{
                  padding: 32,
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-200)',
                  position: 'relative',
                }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    fontWeight: 600,
                    marginBottom: 16,
                  }}>
                    {step.num}
                  </div>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--gray-600)' }}>{step.text}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <div className="steps-mobile" style={{ overflow: 'hidden', width: '100%', marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={4000}>
              {steps.map((step, i) => (
                <div key={i} style={{ padding: 32, background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 600, marginBottom: 16 }}>{step.num}</div>
                  <p style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--gray-600)' }}>{step.text}</p>
                </div>
              ))}
            </MobileCarousel>
          </div>
        </div>
      </section>
    </>
  )
}
