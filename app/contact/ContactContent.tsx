'use client'

import { useState } from 'react'
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
    contactName: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Will be connected to backend later
    alert('Thank you! We will be in touch within one business day.')
  }

  return (
    <>
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

      {/* Contact Form + Details */}
      <section className="section section-alt">
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
                      <option value="anesthesia">Anesthesia</option>
                      <option value="orthopedics">Orthopedics</option>
                      <option value="pain-management">Pain Management</option>
                      <option value="asc">Ambulatory Surgery Center</option>
                      <option value="behavioral-health">Behavioral Health</option>
                      <option value="urgent-care">Urgent Care</option>
                      <option value="other">Other</option>
                    </select>
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
                  <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                    Submit Request
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </button>
                  <p style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 8 }}>
                    We protect client information under HIPAA and SOC 2 standards.
                  </p>
                </form>
              </div>
            </RevealOnScroll>

            {/* Contact Details */}
            <RevealOnScroll delay={0.2}>
              <div style={{ paddingTop: 60 }}>
                <div style={{ marginBottom: 40 }}>
                  <h3 style={{ fontSize: 20, fontWeight: 400, color: 'var(--gray-900)', marginBottom: 24 }}>Contact Details</h3>
                  {[
                    { label: 'Phone', value: '(877) 266-9040', href: 'tel:8772669040' },
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
                  <p style={{ fontSize: 14, lineHeight: 1.6, opacity: 0.7 }}>
                    SOC 2 • HIPAA Compliant • HBMA Member • Inc. 5000 • Great Place to Work
                  </p>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </>
  )
}
