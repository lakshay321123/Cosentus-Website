'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

/* ───────────────────────────────────────────
   DATA
   ─────────────────────────────────────────── */

const rcmSteps = [
  { label: 'Secondary Filing', x: 28, y: 2 },
  { label: 'Accounts Receivable', x: 52, y: 3 },
  { label: 'Appeal Procedure', x: 72, y: 10 },
  { label: 'Patient Billing', x: 82, y: 25 },
  { label: 'Patient Registration', x: 82, y: 48 },
  { label: 'Eligibility & Benefits Check', x: 72, y: 68 },
  { label: 'Data Entry Demographics', x: 55, y: 80 },
  { label: 'Referral & Authorization', x: 35, y: 82 },
  { label: 'Coding & Billing', x: 20, y: 75 },
  { label: 'Charge Posting', x: 10, y: 62 },
  { label: 'Claim Submission', x: 5, y: 45 },
  { label: 'Clearing Denials', x: 5, y: 28 },
  { label: 'Payment Posting', x: 12, y: 15 },
  { label: 'Denial Management', x: 20, y: 5 },
]

const solutions = [
  { title: 'Efficient Billing and Coding', desc: 'Say goodbye to billing errors and delayed payments. Our expert team ensures accuracy and timeliness in every transaction.' },
  { title: 'Maximized Revenue', desc: "We don't just manage your billing; we optimize it to ensure maximum revenue collection." },
  { title: 'Personalized Support', desc: "Our dedicated professionals are always at your service, providing personalized support tailored to your practice's unique needs." },
]

const whatSetsApart = [
  { title: 'Dedicated, Specialty-Trained Teams', desc: 'You get named coders and billing leads who understand your clinical workflows and payer rules.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" /></svg> },
  { title: 'R+A Accuracy & Scale', desc: 'AI handles verification, follow-up, and collections; human specialists handle complex coding, clinical validation, and denials.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg> },
  { title: 'Proactive Denial Prevention', desc: 'Every claim passes payer-specific edits before submission. Every denied dollar is pursued until collected.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg> },
]

const processSteps = [
  { step: '01', title: 'Patient Registration & Eligibility', desc: 'AI verification (Harper) catches issues before service.' },
  { step: '02', title: 'Charge Capture & Coding', desc: 'AAPC-certified coders ensure accurate CPTs, modifiers and clinical documentation alignment.' },
  { step: '03', title: 'Claim Scrubbing & Submission', desc: 'Payer-specific edits for clean claims.' },
  { step: '04', title: 'Payment Posting & Reconciliation', desc: 'Identify underpayments and reconcile payments to expected reimbursements (Michael).' },
  { step: '05', title: 'AR Follow-Up & Denial Management', desc: 'Dedicated teams pursue claims methodically (Chris and human denials experts).' },
  { step: '06', title: 'Patient Billing & Collections', desc: 'Clear statements and empathetic collections (Cindy).' },
]

const outsourcingBenefits = [
  'Over 25 provider specialties',
  '99.4% Clean Claim Submission',
  'Blazing fast turnaround time',
  'Seamless transition and lightning quick ramp-up',
  'Strict internal control audits',
  'Optimized collections and sustained cashflow',
]

const specialties = [
  'Anesthesia', 'Orthopedics', 'Pain Management', 'ASCs', 'Behavioral Health',
  'Urgent Care', 'OBGYN', 'Ophthalmology', 'Endoscopy', 'General Surgery',
  'ENT', 'Dermatology',
]

/* ── Page FAQs from cosentus.com/services/medical-billing/ ── */
const pageFaqs = [
  { q: 'What are some common challenges in medical billing and coding?', a: 'Medical billing and coding have many challenges that can strain your practice\'s efficiency and profitability. Here are some common pain points: Ever-changing landscape of rules and regulations — Keeping up with the latest healthcare regulations and insurance policies can be overwhelming. The complexity of medical codes and terminology — Navigating thousands of codes and ensuring accurate documentation requires expertise. Sporadic increases in the volume of patients leading to backlogs and delays — Managing fluctuating patient volumes can create administrative bottlenecks. Handling denied or rejected claims — Addressing denied claims is time-consuming and can significantly impact revenue.' },
  { q: 'What are the benefits of outsourcing medical billing and coding services?', a: 'Outsourcing your medical billing and coding tasks can offer numerous advantages: Maximize revenue — Reduce claim denials and optimize reimbursements. Ensure accuracy — Minimize errors in coding and billing to avoid costly mistakes. Effective claim submission and processing — Improve the efficiency of your billing cycle with expert handling. Information management — Maintain organized and up-to-date patient records and billing information.' },
  { q: 'What are the benefits of working with your medical billing and coding services?', a: 'Following are the multiple benefits of working with us: Higher profitability — Increase your practice\'s bottom line with optimized billing. Faster reimbursements — Speed up the payment cycle and improve cash flow. HIPAA-compliance — Ensure your practice adheres to all privacy and security regulations. Affordable pricing — Get cost-effective solutions tailored to your needs. Reduced operating costs — Save on staffing and administrative expenses. Reduced staffing issues — Avoid the hassles of hiring and training in-house staff. Denial Analysis — Monitor and manage claim denials effectively.' },
  { q: 'Why Do Healthcare Providers Need Medical Billing Services?', a: 'Medical billing services help ensure accurate claim submissions, reduce administrative burdens, and optimize revenue cycles.' },
  { q: 'What Software Is Needed for Medical Billing and Coding?', a: 'We use advanced, industry-standard software to ensure accuracy, compliance, and efficient medical claims processing.' },
]

/* ── FAQs from cosentus.com/faqs/ Medical Billing section ── */
const faqsPageBilling = [
  { q: 'What types of practices are ideal for your medical billing services?', a: 'As a multi-specialty billing company, we have the knowledge and expertise to help many different types of practices. We specialize in Ambulatory Surgery Centres, Orthopaedics and Orthopaedic surgery, Pain Management, Anaesthesiology, Mental Health, Vein & Vascular, General Surgery, Radiology, Cardiology, Spinal Surgery, Pulmonology, Endocrinology, Dermatology, Neurology, GI, and more.' },
  { q: 'Do you work with insurance companies?', a: 'Absolutely. We work with any and all insurance plans for which you are an approved provider, including state Medicaid programs and HMO plans.' },
  { q: 'How will you access our patients\' information?', a: 'We can easily get direct access to your EHR for your convenience if the system is cloud based or you can provide us the information needed through a secure transfer via Microsoft SharePoint. We have experience working with over 15 different EHR systems.' },
  { q: 'How much does it cost to work with you?', a: 'There is no one answer to this question, as we create customized proposals for every client. In most cases, we work under a "pay for performance" model, retaining a percentage of all of the funds we collect on your behalf. This benefits you, as you only pay us based on what we collect, but also works as a great incentive for our team.' },
  { q: 'Will one person manage our account?', a: 'One of our experienced account managers will be your primary point of contact; however, you\'ll have the support of an entire team. That\'s how we make sure to work on your account every single workday.' },
]


/* ───────────────────────────────────────────
   INTERACTIVE RCM CYCLE — p1-2a.png + animated overlays
   ─────────────────────────────────────────── */

function InteractiveRCMCycle() {
  const [active, setActive] = useState(-1)
  const [revealed, setRevealed] = useState(0)

  // Sequential reveal — one label at a time
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i++
      if (i <= rcmSteps.length) setRevealed(i)
      else clearInterval(id)
    }, 300)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 560, margin: '0 auto' }}>
      {/* Base diagram — mix-blend-mode so white shows, rest blends */}
      <img src="/images/icons/p1-2a.png" alt="Revenue Cycle Management" style={{
        width: '100%', height: 'auto', display: 'block',
        mixBlendMode: 'screen',
        animation: 'diagramFloat 5s ease-in-out infinite',
      }} />

      {/* HTML text labels — appear one at a time */}
      {rcmSteps.map((step, i) => (
        <div key={i}
          onMouseEnter={() => setActive(i)}
          onMouseLeave={() => setActive(-1)}
          style={{
            position: 'absolute', left: `${step.x}%`, top: `${step.y}%`,
            fontSize: 9, fontWeight: 700, color: 'white',
            textTransform: 'uppercase', letterSpacing: '0.03em',
            lineHeight: 1.2, textAlign: 'center', cursor: 'pointer',
            opacity: i < revealed ? 1 : 0,
            transform: i < revealed ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
            textShadow: active === i ? '0 0 12px rgba(255,255,255,0.8)' : '0 1px 3px rgba(0,0,0,0.15)',
          }}
        >
          {step.label}
        </div>
      ))}

      {/* Rotating orbit dot */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        width: '80%', height: '80%', borderRadius: '50%', pointerEvents: 'none',
        animation: 'spinSlow 15s linear infinite',
      }}>
        <div style={{ position: 'absolute', top: -3, left: '50%', transform: 'translateX(-50%)', width: 6, height: 6, borderRadius: '50%', background: 'white', boxShadow: '0 0 10px rgba(255,255,255,0.8)' }} />
      </div>

      {/* Center glow */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        width: 100, height: 100, borderRadius: '50%', pointerEvents: 'none',
        animation: 'centerGlow 3s ease-in-out infinite',
      }} />

      <style jsx>{`
        @keyframes diagramFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes spinSlow { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes centerGlow { 0%, 100% { box-shadow: 0 0 30px rgba(255,255,255,0.15), 0 0 60px rgba(0,181,214,0.1); } 50% { box-shadow: 0 0 45px rgba(255,255,255,0.3), 0 0 80px rgba(0,181,214,0.2); } }
      `}</style>
    </div>
  )
}


/* ───────────────────────────────────────────
   FAQ — blog card style
   ─────────────────────────────────────────── */

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{ marginBottom: 8, borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', overflow: 'hidden', transition: 'border-color 0.2s ease', borderColor: isOpen ? '#00B5D6' : 'var(--gray-200)' }}>
      <button onClick={onToggle} aria-expanded={isOpen} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '18px 24px', background: isOpen ? 'var(--primary-ghost)' : 'var(--gray-50)', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16, transition: 'background 0.2s ease', fontFamily: 'var(--font-body)' }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-900)', lineHeight: 1.5, flex: 1 }}>{q}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#00B5D6" strokeWidth={2.5} style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {isOpen && (
        <div style={{ padding: '0 24px 20px', background: 'white' }}>
          <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--gray-600)', paddingTop: 12, margin: 0 }}>{a}</p>
        </div>
      )}
    </div>
  )
}

function FAQGroup({ title, faqs }: { title: string; faqs: Array<{ q: string; a: string }> }) {
  const [openIndex, setOpenIndex] = useState(-1)
  return (
    <div style={{ marginBottom: 48 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 16, fontFamily: 'var(--font-display)' }}>{title}</h3>
      <div>
        {faqs.map((faq, i) => (
          <FAQItem key={i} q={faq.q} a={faq.a} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
        ))}
      </div>
    </div>
  )
}


/* ───────────────────────────────────────────
   MAIN CONTENT
   ─────────────────────────────────────────── */

export default function BillingCodingContent() {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '55vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src="/videos/hero-banner.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,30,50,0.75) 0%, rgba(0,80,100,0.6) 50%, rgba(0,40,60,0.7) 100%)', zIndex: 1 }} />
        <div className="hero-content" style={{ paddingTop: 160, paddingBottom: 60, position: 'relative', zIndex: 2 }}>
          <RevealOnScroll>
            <div className="hero-badge"><div className="hero-badge-dot" /><span>MEDICAL BILLING & CODING</span></div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.03em', lineHeight: 1.02, color: 'white', marginBottom: 24 }}>
              Expert-Led Medical Billing<br />Across 20+ Specialties.
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="hero-sub" style={{ maxWidth: 680, color: 'rgba(255,255,255,0.85)' }}>
              Medical billing and coding for physician practices, specialty groups, and surgery centers. One focus: maximize revenue while ensuring compliance. Powered by Real&nbsp;+&nbsp;Artificial&nbsp;Intelligence.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.3}>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary">
                Get Your Free Revenue Analysis
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">MEDICAL BILLING & CODING</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Medical Billing & Coding Services</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="section-desc">
              In the dynamic world of healthcare, effective billing management is the cornerstone of a thriving practice. At Cosentus, we redefine this concept through our comprehensive Revenue Cycle Management (RCM) services. But let&apos;s simplify it – think of it as Billing Management, but supercharged.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── RCM CYCLE DIAGRAM — teal section ── */}
      <section style={{ padding: '80px 0', background: 'var(--primary)', color: 'white', overflow: 'hidden' }}>
        <div className="container">
          <RevealOnScroll>
            <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 300, fontFamily: 'var(--font-display)', marginBottom: 56, lineHeight: 1.3 }}>
              Transform Your Practice with Expert Medical Billing & Coding Services
            </h2>
          </RevealOnScroll>
          <div className="billing-rcm-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <RevealOnScroll direction="left">
              <InteractiveRCMCycle />
            </RevealOnScroll>
            <RevealOnScroll direction="right">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                  <img src="/images/icons/c2.png" alt="Medical Billing" style={{ width: 56, height: 56 }} />
                  <h3 style={{ fontSize: 26, fontWeight: 700, fontFamily: 'var(--font-display)', lineHeight: 1.2 }}>MEDICAL BILLING<br />& CODING</h3>
                </div>
                <p style={{ fontSize: 16, lineHeight: 1.8, color: 'rgba(255,255,255,0.9)' }}>
                  Our approach to Billing Management is not just about processing invoices; it&apos;s a transformative journey for your practice. Revenue Cycle Management, at its core, is a financial process utilizing medical billing software to track patient care episodes from registration and appointment scheduling to the final payment of a balance. It&apos;s the lifeline of your practice&apos;s financial health, ensuring that you get paid fully and promptly for the services you provide.
                </p>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ── SOLUTIONS — arrow-shaped cards ── */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">SOLUTIONS</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Solutions Tailored for Growing Your Medical Practice</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="section-desc">At Cosentus, we don&apos;t just offer services; we deliver solutions. Our suite of offerings is designed to be intuitive and impactful:</p>
          </RevealOnScroll>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 48 }}>
            {solutions.map((s, i) => (
              <RevealOnScroll key={i} direction="scale" delay={0.2 + i * 0.15}>
                <div style={{ position: 'relative', textAlign: 'center' }}>
                  <div style={{ width: '100%', aspectRatio: '1.26', background: "url('/images/growth-arrow.png') center / contain no-repeat", position: 'relative' }} />
                  <div style={{ marginTop: -60, position: 'relative', zIndex: 2, padding: '0 20px 20px' }}>
                    <h4 style={{ fontSize: 17, fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>{s.title}</h4>
                    <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--gray-600)' }}>{s.desc}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT SETS US APART ── */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">WHAT SETS US APART</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">What Sets Cosentus Billing Apart</div>
          </RevealOnScroll>
          <div className="advantage-grid" style={{ marginTop: 48 }}>
            {whatSetsApart.map((item, i) => (
              <RevealOnScroll key={i} direction="scale" delay={0.15 + i * 0.1}>
                <div className="advantage-card">
                  <div className="advantage-icon">{item.icon}</div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR PROCESS ── */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">OUR PROCESS</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Our Billing Process</div>
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 48 }}>
            {processSteps.map((p, i) => (
              <RevealOnScroll key={i} delay={0.1 + i * 0.08}>
                <div style={{ padding: 32, background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', transition: 'border-color 0.3s ease, box-shadow 0.3s ease' }} className="advantage-card">
                  <div style={{ fontSize: 36, fontWeight: 200, color: 'var(--primary)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>{p.step}</div>
                  <h4 style={{ fontSize: 16, fontWeight: 500, color: 'var(--gray-900)', marginBottom: 8 }}>{p.title}</h4>
                  <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.6 }}>{p.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENEFITS OF OUTSOURCING — clean stats ── */}
      <section style={{ padding: '80px 0', background: 'var(--primary)', color: 'white' }}>
        <div className="container">
          <RevealOnScroll>
            <div className="section-label" style={{ color: 'rgba(255,255,255,0.6)' }}>WHY OUTSOURCE</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 300, fontFamily: 'var(--font-display)', marginBottom: 48, lineHeight: 1.2 }}>
              Benefits of Outsourcing Your Billing
            </h2>
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { stat: '25+', label: 'Provider Specialties' },
              { stat: '99.4%', label: 'Clean Claim Rate' },
              { stat: '0', label: 'Re-work Required' },
            ].map((item, i) => (
              <RevealOnScroll key={i} delay={0.15 + i * 0.1}>
                <div style={{ padding: '36px 28px', background: 'rgba(255,255,255,0.08)', borderRadius: 'var(--radius-md)', backdropFilter: 'blur(4px)', borderLeft: '3px solid rgba(255,255,255,0.3)' }}>
                  <div style={{ fontSize: 'clamp(36px, 4vw, 48px)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: 4 }}>{item.stat}</div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <RevealOnScroll delay={0.5}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 32 }}>
              {['Blazing fast turnaround', 'Seamless transition & ramp-up', 'Optimized collections & cashflow'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, color: 'rgba(255,255,255,0.85)' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 8l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {t}
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── SPECIALTIES TICKER ── */}
      <section style={{ padding: '48px 0', overflow: 'hidden' }}>
        <div className="container" style={{ marginBottom: 24 }}>
          <RevealOnScroll>
            <div className="section-label">SPECIALTIES WE SERVE</div>
          </RevealOnScroll>
        </div>
        <div style={{ position: 'relative', width: '100%', overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
          <div style={{ display: 'flex', animation: 'scrollTicker 25s linear infinite', width: 'max-content' }}>
            {[...specialties, ...specialties].map((s, i) => (
              <span key={i} style={{ whiteSpace: 'nowrap', padding: '0 32px', fontSize: 18, fontWeight: 300, color: 'var(--gray-700)', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}><path d="M7 0v14M0 7h14" stroke="#00B5D6" strokeWidth="2" strokeLinecap="round" /></svg>
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section section-alt" id="faq">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">FREQUENTLY ASKED QUESTIONS</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Frequently Asked Questions</div>
          </RevealOnScroll>
          <div style={{ marginTop: 48 }}>
            <FAQGroup title="Medical Billing & Coding" faqs={pageFaqs} />
            <FAQGroup title="Working with Cosentus" faqs={faqsPageBilling} />
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container">
          <RevealOnScroll direction="scale">
            <div className="cta-box">
              <h2>See What Your Practice<br />Is Leaving on the Table</h2>
              <Link href="/contact" className="btn-primary">
                Get Your Free Revenue Analysis
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 768px) {
          .billing-rcm-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </>
  )
}
