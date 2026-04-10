'use client'

import { useState } from 'react'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

/* ───────────────────────────────────────────
   DATA
   ─────────────────────────────────────────── */

const benefits = [
  { title: 'Effortless Workflow', desc: 'Our integrated approach ensures a seamless operation, eliminating inefficiencies and optimizing your practice\'s performance.' },
  { title: 'Focus on Patient Care', desc: 'With administrative tasks expertly handled by our team, you can dedicate more time and energy to what matters most – patient care.' },
  { title: 'Improved Patient Experience', desc: 'A well-managed practice translates to a better patient experience, fostering satisfaction and loyalty.' },
  { title: 'Expert Billing Management', desc: 'Say goodbye to high accounts receivable and confusing billing issues. Our billing experts streamline your processes, ensuring maximum revenue collection with minimal hassle.' },
]

const operations = [
  { title: 'Expert Billing Management', desc: 'Say goodbye to high accounts receivable and confusing billing issues. Our billing experts streamline your processes, ensuring maximum revenue collection with minimal hassle.', img: '/images/icons/p3-3a.png' },
  { title: 'Accounting & Tax Services', desc: 'Dive into financial clarity with our team. We automate and manage your accounting processes, ensuring efficiency and compliance, so you can focus on your practice without financial distractions.', img: '/images/icons/p3-3b.png' },
  { title: 'Technology Solutions', desc: 'Embrace the future with our Managed IT services. We handle everything from patient billing systems to data security, ensuring seamless and efficient technology integration in your practice.', img: '/images/icons/p3-3c.png' },
  { title: 'Human Resources & Recruitment', desc: 'Overcome staffing challenges effortlessly. Our HR services provide comprehensive support, from recruiting top talent to managing HR tasks, ensuring your practice runs smoothly.', img: '/images/icons/p3-3d.png' },
  { title: 'Marketing & Branding', desc: 'Elevate your online presence. Our marketing experts craft strategies that enhance your visibility, attract new patients, and build a strong, engaging brand identity.', img: '/images/icons/p3-3e.png' },
]

const whatWeManage = [
  { title: 'Front Desk Optimization', desc: 'Scheduling, intake, insurance verification, and co-pay collection; yields 5–15% additional revenue in many practices.' },
  { title: 'Financial Performance Reporting', desc: 'Practice-level dashboards, cash-flow visibility, and revenue performance tracking.' },
  { title: 'Credentialing Services', desc: 'Provider credentialing and re-credentialing with major payers.' },
  { title: 'Operational Consulting', desc: 'Staffing optimization, workflow analysis and growth planning.' },
  { title: 'Reporting & Visibility', desc: 'Real-time dashboards and weekly performance reviews.' },
]

/* ── Page FAQs from cosentus.com/services/complete-practice-management/ ── */
const pageFaqs = [
  { q: 'What Is Total Practice Management?', a: 'Total Practice Management refers to comprehensive services that handle all administrative aspects of a medical practice, allowing healthcare providers to focus on patient care. This includes billing, accounting, HR, technology solutions, and marketing.' },
  { q: 'Why Is Medical Practice Management Important?', a: 'Medical Practice Management is important because it helps optimize administrative operations, ensures financial health, and improves overall efficiency. This allows healthcare providers to devote more time to patient care and enhances the patient experience.' },
  { q: 'What are the benefits of medical practice management?', a: 'Total medical practice management streamlines operations with integrated workflows and automation. It boosts financial health through better billing and revenue management. Patient care improves by allowing more focus on patients while ensuring regulatory compliance. Plus, it enhances online presence and patient engagement, supporting marketing and growth.' },
  { q: 'What services are included in your practice management solutions?', a: 'Our Practice Management Services encompass a comprehensive range of solutions designed to optimize various aspects of your practice. Billing Management: Optimizes revenue cycle. Accounting & Tax Services: Financial clarity and compliance. Technology Solutions: IT management and data security. HR & Recruitment: Staffing and human resources support. Marketing & Branding: Boosts online visibility and patient engagement.' },
  { q: 'How to Select the Right Practice Management Provider', a: 'Consider the provider\'s experience, service range, technological capabilities, client support, and ability to customize solutions to your practice\'s specific needs.' },
  { q: 'What Is the Difference Between EMR and a Practice Management Service?', a: 'An EMR system digitizes patient records and clinical workflows, whereas a Practice Management Service handles administrative tasks like scheduling, billing, and HR, often integrating with EMR systems for seamless operations.' },
  { q: 'How Does Practice Management Improve Office Efficiency?', a: 'Practice Management improves office efficiency by automating administrative tasks, streamlining workflows, reducing errors, and providing comprehensive support, enhancing productivity and patient satisfaction.' },
]

/* ── FAQs from cosentus.com/faqs/ Complete Practice Management section ── */
const faqsPagePM = [
  { q: 'Can you describe how the Complete Practice Management service improves the patient care experience?', a: 'Our RCM services are comprehensive, and we manage ALL of it: Eligibility and benefit verification, Referral and Authorization Management, Coding, Claim Submission, Payment Posting, Bank reconciliation, Rejection and Denial Management with Denial Prevention, AR management, Patient Statement processing and soft collection calls through our dedicated patient services team in Irvine, CA, Customized Dashboard reporting. We also help with other administrative and time consuming tasks like Credentialing, Electronic connections with payers, Fee master, etc. This frees up the office staff and physicians to focus on one task alone, i.e. patient care.' },
  { q: 'Do you assign one person to my account?', a: 'We assign an experienced account manager to your practice. Your AM works closely with you on optimizing every aspect of your RCM. Every account manager has a team of billers, coders and AR professionals working for them. We meet our customers weekly for the first 120 days and then bi-weekly thereafter. This meeting is attended by your AM, a VP level employee and also your sales rep. We call these meetings accountability meetings, and your AM comes prepared to share the progress being made towards the monthly goal and also answer any questions.' },
  { q: 'How do we get documentation for you?', a: 'For most of our customers we get access to their EHR and from there the documentation management is completely taken care of by the Cosentus team. In case you are unable to give us access to the EHR or if all the relevant documentation is not available in the EHR, we set you up with a SharePoint site and train your staff to scan papers directly to the PHI secure site. It\'s super easy and works just like scanning a document to a folder on your computer.' },
  { q: 'Where is your team located? Can we meet face-to-face?', a: 'Our accounting team members are primarily located in Billings, Montana and Denver, Colorado. We\'ve worked hard to create processes that allow us to work with clients throughout the U.S. by utilizing cloud-based software technology to access the accounting records from anywhere, and communicating via Zoom and other video conferencing platforms. We would love to jump on virtual meetings and put a face to a name.' },
  { q: 'How will my vendors be paid?', a: 'Bill.com is an easy-to-use program that allows you to see and approve every invoice before it\'s paid. Once approved, we cut the checks or issue ACH payments directly from the program.' },
  { q: 'What do you provide in terms of financial statements and how often will I receive financial reports?', a: 'We provide a Profit & Loss Statement along with a Balance Sheet Statement, sent to you between the 15th and 20th of each month. If an earlier deadline is required, arrangements must be made in advance. Other reports are available upon request.' },
  { q: 'How do I submit my tax information to you? Is it kept securely?', a: 'We receive records in a variety of formats, including both paper and electronic. If paper items are submitted to us, they are scanned into a digital format. All documentation and communications are stored in secure folders within an encrypted system. We use a preeminent cloud-based tax software which is secured using the latest and best technology. We use an encrypted portal for transmitting or receiving all sensitive or confidential data.' },
  { q: 'How do you bill for your services?', a: 'We bill by the hour for actual time spent on client work, and only include a flat charge for production. Most often, we issue invoices at the end of a specific project, such as the completion of a tax return; however, we may discuss periodic progress billings for a long or especially comprehensive tax project or to assist in your cash management.' },
  { q: 'What are the professional qualifications of your preparers?', a: 'Our tax preparers of record (the individuals that sign returns) are either Certified Public Accountants or Enrolled Agents (enrolled to practice before the IRS). All of our staff members hold a minimum of a four-year college degree in accounting or a related subject, and each is directly supervised by a CPA or EA responsible for the clients\' returns.' },
  { q: 'I have read about changes in tax laws. How do you keep up with the changes?', a: 'In addition to receiving information from multiple tax services that keep us abreast of changes, we all attend educational events designed to improve our understanding of current and new tax laws. Our staff also participates in internal training sessions covering existing tax laws and new changes.' },
]


/* ───────────────────────────────────────────
   INTERACTIVE MIND MAP — fully built in HTML/CSS
   ─────────────────────────────────────────── */

const roles = [
  { label: 'Book Keeper', x: 18, y: 8, icon: '📋', delay: 0 },
  { label: 'Marketing Strategy', x: 75, y: 8, icon: '🎯', delay: 0.3 },
  { label: 'Tech Support', x: 88, y: 48, icon: '⚙️', delay: 0.6 },
  { label: 'People Manager', x: 75, y: 82, icon: '👥', delay: 0.9 },
  { label: 'Billing Expert', x: 45, y: 90, icon: '💲', delay: 1.2 },
  { label: 'Online Marketing', x: 15, y: 82, icon: '📊', delay: 1.5 },
  { label: 'Office Admin', x: 5, y: 48, icon: '🗂️', delay: 1.8 },
]

function InteractiveMindMap() {
  const [active, setActive] = useState(-1)

  return (
    <div className="mindmap-container" style={{ position: 'relative', width: '100%', maxWidth: 540, aspectRatio: '1.2 / 1', margin: '0 auto' }}>

      {/* SVG connection lines */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'visible' }}>
        {roles.map((r, i) => (
          <line key={i} x1="47" y1="47" x2={r.x + 4} y2={r.y + 4}
            stroke={active === i ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)'}
            strokeWidth={active === i ? '0.6' : '0.3'}
            style={{ transition: 'all 0.4s ease' }}
          />
        ))}
        {/* Animated pulse dots on lines */}
        {roles.map((r, i) => (
          <circle key={`dot-${i}`} r="0.8"
            fill="rgba(255,255,255,0.7)"
          >
            <animateMotion
              dur={`${2.5 + i * 0.2}s`}
              repeatCount="indefinite"
              path={`M47,47 L${r.x + 4},${r.y + 4}`}
            />
          </circle>
        ))}
        {/* Teal dots at connection joints */}
        {roles.map((r, i) => {
          const jx = 47 + (r.x + 4 - 47) * 0.55
          const jy = 47 + (r.y + 4 - 47) * 0.55
          return <circle key={`joint-${i}`} cx={jx} cy={jy} r="1.2" fill="white" opacity="0.5" />
        })}
      </svg>

      {/* Center node — doctor */}
      <div style={{
        position: 'absolute', left: '47%', top: '47%', transform: 'translate(-50%, -50%)',
        width: 100, height: 100, borderRadius: '50%',
        background: 'linear-gradient(135deg, #00c9e8 0%, #00B5D6 100%)',
        border: '6px solid rgba(255,255,255,0.3)',
        boxShadow: '0 0 40px rgba(0,181,214,0.4), 0 0 80px rgba(0,181,214,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 5, animation: 'centerPulse 3s ease-in-out infinite',
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={1.2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      </div>

      {/* Outer role nodes */}
      {roles.map((r, i) => {
        const isActive = active === i
        return (
          <div
            key={i}
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(-1)}
            style={{
              position: 'absolute',
              left: `${r.x}%`, top: `${r.y}%`,
              zIndex: isActive ? 10 : 2,
              animation: `nodeFloat ${3 + i * 0.4}s ease-in-out infinite`,
              animationDelay: `${r.delay}s`,
              cursor: 'pointer',
            }}
          >
            {/* Node circle */}
            <div style={{
              width: isActive ? 72 : 60, height: isActive ? 72 : 60,
              borderRadius: '50%',
              background: isActive ? 'white' : 'rgba(255,255,255,0.95)',
              border: `2px solid ${isActive ? 'white' : 'rgba(255,255,255,0.6)'}`,
              boxShadow: isActive
                ? '0 0 30px rgba(255,255,255,0.5), 0 8px 32px rgba(0,0,0,0.15)'
                : '0 4px 16px rgba(0,0,0,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              fontSize: isActive ? 28 : 22,
            }}>
              {r.icon}
            </div>

            {/* Label */}
            <div style={{
              textAlign: 'center', marginTop: 6,
              fontSize: 12, fontWeight: isActive ? 700 : 500,
              color: 'white', lineHeight: 1.3,
              textShadow: '0 1px 4px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
            }}>
              {r.label.split(' ').map((w, wi) => <span key={wi}>{w}<br /></span>)}
            </div>

            {/* Pulse ring on active */}
            {isActive && (
              <div style={{
                position: 'absolute', top: 0, left: 0,
                width: 72, height: 72, borderRadius: '50%',
                border: '2px solid rgba(255,255,255,0.6)',
                animation: 'mindMapPulse 1.2s ease-out infinite',
              }} />
            )}
          </div>
        )
      })}

      <style jsx>{`
        @keyframes nodeFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes centerPulse {
          0%, 100% { box-shadow: 0 0 40px rgba(0,181,214,0.4), 0 0 80px rgba(0,181,214,0.15); }
          50% { box-shadow: 0 0 50px rgba(0,181,214,0.6), 0 0 100px rgba(0,181,214,0.25); }
        }
        @keyframes mindMapPulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  )
}


/* ───────────────────────────────────────────
   FAQ — blog card style
   ─────────────────────────────────────────── */

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{
      marginBottom: 8, borderRadius: 'var(--radius-md)',
      border: '1px solid var(--gray-200)', overflow: 'hidden',
      transition: 'border-color 0.2s ease',
      borderColor: isOpen ? '#00B5D6' : 'var(--gray-200)',
    }}>
      <button onClick={onToggle} aria-expanded={isOpen} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        width: '100%', padding: '18px 24px',
        background: isOpen ? 'var(--primary-ghost)' : 'var(--gray-50)',
        border: 'none', cursor: 'pointer', textAlign: 'left',
        gap: 16, transition: 'background 0.2s ease', fontFamily: 'var(--font-body)',
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-900)', lineHeight: 1.5, flex: 1 }}>{q}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#00B5D6" strokeWidth={2.5}
          style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
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
   MAIN PAGE CONTENT
   ─────────────────────────────────────────── */

export default function PracticeManagementContent() {
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
            <div className="hero-badge"><div className="hero-badge-dot" /><span>COMPLETE PRACTICE MANAGEMENT</span></div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.03em', lineHeight: 1.02, color: 'white', marginBottom: 24 }}>
              Run a More Profitable Practice<br />Without Adding to Your Workload.
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="hero-sub" style={{ maxWidth: 680, color: 'rgba(255,255,255,0.85)' }}>
              We manage the operational complexity of running a medical practice — front desk to credentialing, reporting, and consulting — so your clinical team focuses on patients.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.3}>
            <div className="hero-actions">
              <Link href="/contact" className="btn-primary">
                Get Your Free Practice Assessment
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── INTRO ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800, textAlign: 'center' }}>
          <RevealOnScroll>
            <div className="section-label" style={{ textAlign: 'center' }}>PRACTICE MANAGEMENT</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title" style={{ textAlign: 'center' }}>Practice Management Services</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="section-desc" style={{ textAlign: 'center' }}>
              Beyond billing, our Complete Practice Management encompasses every administrative aspect of your practice. From patient scheduling to data management, we handle it all. This holistic approach means more time for patient care and less time worrying about paperwork.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── BENEFITS — teal section with mind map ── */}
      <section style={{ padding: '80px 0', background: 'var(--primary)', color: 'white', overflow: 'hidden' }}>
        <div className="container">
          <RevealOnScroll>
            <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 300, fontFamily: 'var(--font-display)', marginBottom: 56, lineHeight: 1.3 }}>
              Benefits of Our Practice Management Services
            </h2>
          </RevealOnScroll>

          <div className="pm-benefits-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <RevealOnScroll direction="left">
              <InteractiveMindMap />
            </RevealOnScroll>

            <RevealOnScroll direction="right">
              <div>
                <h3 style={{ fontSize: 26, fontWeight: 600, lineHeight: 1.3, marginBottom: 32, fontFamily: 'var(--font-display)' }}>
                  Complete Practice<br />Management
                </h3>
                {benefits.map((b, i) => (
                  <div key={i} style={{ marginBottom: 20 }}>
                    <p style={{ fontSize: 15, lineHeight: 1.75 }}>
                      <strong>{b.title}:</strong> {b.desc}
                    </p>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ── STREAMLINED OPERATIONS ── */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">STREAMLINED OPERATIONS</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Streamlined Operations for Peak Efficiency</div>
          </RevealOnScroll>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24, marginTop: 48 }}>
            {operations.map((op, i) => (
              <RevealOnScroll key={i} direction="scale" delay={0.1 + i * 0.08}>
                <div className="advantage-card" style={{ height: '100%' }}>
                  <div className="advantage-icon">
                    <img src={op.img} alt={op.title} style={{ width: 26, height: 26, objectFit: 'contain' }} />
                  </div>
                  <h4>{op.title}</h4>
                  <p>{op.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE MANAGE (from v5 messaging doc) ── */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">WHAT WE MANAGE</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Everything Behind the Scenes</div>
          </RevealOnScroll>
          <div className="advantage-grid" style={{ marginTop: 48 }}>
            {whatWeManage.map((s, i) => (
              <RevealOnScroll key={i} direction="scale" delay={0.1 + i * 0.08}>
                <div className="advantage-card">
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY OUTSOURCE ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800, textAlign: 'center' }}>
          <RevealOnScroll>
            <div className="section-label" style={{ textAlign: 'center' }}>WHY OUTSOURCE</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title" style={{ textAlign: 'center' }}>Why Outsource Practice Management</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="section-desc" style={{ textAlign: 'center' }}>
              Reduce administrative overhead, improve front-end revenue capture, and gain predictable financial performance. Your clinical team stays focused on patients while we handle operations, reporting, and growth.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section section-alt" id="faq">
        <div className="container" style={{ maxWidth: 900 }}>
          <RevealOnScroll>
            <div className="section-label">FREQUENTLY ASKED QUESTIONS</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Frequently Asked Questions</div>
          </RevealOnScroll>
          <div style={{ marginTop: 48 }}>
            <FAQGroup title="Practice Management" faqs={pageFaqs} />
            <FAQGroup title="Complete Practice Management — Operations & Accounting" faqs={faqsPagePM} />
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
                Get Your Free Practice Assessment
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 768px) {
          .pm-benefits-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </>
  )
}
