'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import MotionReveal from '@/components/ui/MotionReveal'

/* ───────────────────────────────────────────
   DATA
   ─────────────────────────────────────────── */

const wheelSegments = [
  { label: 'Patient\nScheduling', icon: '📅' },
  { label: 'Verification\nof Benefits', icon: '✓' },
  { label: 'Authorization\nManagement', icon: '🔐' },
  { label: 'Customizable\nEHR', icon: '💻' },
  { label: 'Charge\nIntegration', icon: '💳' },
  { label: 'Coding/\nScrubbing', icon: '🔍' },
  { label: 'Claim\nSubmission', icon: '📤' },
  { label: 'Rejection\nManagement', icon: '↩' },
  { label: 'ERA\nManagement', icon: '📊' },
  { label: 'Denial & Appeal\nManagement', icon: '⚖' },
  { label: 'Accounts Receivable\nManagement', icon: '💰' },
  { label: 'Customized\nDashboards', icon: '📈' },
]

const medcloudFeatures = [
  { title: 'Innovative Cloud-Based Solutions', desc: 'Medcloud leverages the power of the cloud for enhanced accessibility and scalability in healthcare management.' },
  { title: 'Integrated Software Platform', desc: 'A comprehensive suite of tools for patient management, scheduling, and billing, all within a unified software environment.' },
  { title: 'Data Security and Compliance', desc: 'Ensures the security of patient data with robust encryption and adherence to healthcare regulations, including HIPAA.' },
  { title: 'Real-Time Data Access', desc: 'Provides immediate access to patient information and practice analytics, enabling informed decision-making.' },
  { title: 'User-Centric Design', desc: 'Features an intuitive interface that simplifies user interaction, making it easier for healthcare providers and staff to adapt.' },
  { title: 'Customization and Flexibility', desc: 'Adapts to the unique needs of different healthcare practices with customizable features and workflows.' },
  { title: 'Seamless Integration', desc: 'Easily integrates with existing healthcare systems and databases for a cohesive workflow and consistent data management.' },
]

const medcloudHighlights = [
  'Flexible, Scalable & Customizable',
  'API Integrations with almost any program',
  'Enhanced patient care & billing compliance',
  '360 Degree Practice Management Capabilities',
]

const ehrs = ['Epic', 'Athenahealth', 'eClinicalWorks', 'AdvancedMD', 'ModMed', 'nxGen', 'ClarityStack', 'HALOMD', 'Medcloud']

const capabilities = [
  { title: 'Clinical Documentation', desc: 'Specialty templates that support both quality and reimbursement.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg> },
  { title: 'Practice Management', desc: 'Scheduling, insurance management, demographic capture.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg> },
  { title: 'Billing Integration', desc: 'Seamless charge flow to Cosentus billing.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg> },
  { title: 'Reporting & Analytics', desc: 'Financial and clinical dashboards for operational decisions.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg> },
  { title: 'Interoperability', desc: 'Cloud-based and HIPAA-compliant infrastructure ensures enterprise-grade security across all integrations.', icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" /></svg> },
]

/* ── EHR-specific FAQs from cosentus.com/services/ehr-software/ ── */
const ehrPageFaqs = [
  { q: 'What Is an EHR Software?', a: 'Electronic Health Record (EHR) software digitizes patient records, enhancing accessibility, accuracy, and management of health information.' },
  { q: 'What are the types of EHR systems?', a: 'EHR systems vary by deployment (cloud-based vs. on-premise) and functionality (basic record-keeping to comprehensive practice management).' },
  { q: 'What are the differences between EMR and EHR?', a: 'Electronic Medical Records (EMR) are digital versions of paper charts for individual practices, while EHRs provide broader, interoperable data across multiple healthcare settings.' },
  { q: 'What are the benefits of using EHR software?', a: 'Benefits include improved patient care, streamlined workflows, enhanced data accuracy, and compliance with healthcare regulations.' },
  { q: 'What features and capabilities does Medcloud\'s EHR software offer?', a: 'Medcloud offers real-time data access, robust security, user-friendly design, customization, and seamless integration with other systems.' },
  { q: 'How an EHR System Benefits Private Practices', a: 'EHR systems improve efficiency, patient care, and financial performance by centralizing patient information and automating administrative tasks.' },
  { q: 'How an EHR Improves Patient Care', a: 'EHRs provide accurate, up-to-date patient information, facilitating better diagnosis, treatment, and coordinated care.' },
  { q: 'How Much Does an EHR System Cost?', a: 'Costs vary based on features, scale, and provider, often including implementation fees, subscription fees, and maintenance costs.' },
  { q: 'How Long Does It Take to Implement an EHR System?', a: 'Implementation time can range from several weeks to months, depending on the system\'s complexity and practice size.' },
  { q: 'How Does an EHR Reduce Medical Errors?', a: 'EHRs reduce errors through standardized data entry, real-time alerts, and comprehensive patient information.' },
  { q: 'How Is EHR Data Stored?', a: 'EHR data is stored securely on cloud servers or on-premise systems, with encryption and access controls to protect patient information.' },
  { q: 'What Does It Mean if an EHR System Is Certified?', a: 'Certification ensures the EHR meets specific functionality, security, and interoperability standards set by regulatory bodies.' },
  { q: 'Do EHRs Follow Patients When They Change or Add Healthcare Providers?', a: 'Yes, certified EHRs are designed to be interoperable, allowing patient records to be shared across different healthcare providers for continuity of care.' },
]

/* ── EHR & Practice Management Software FAQs from cosentus.com/faqs/ ── */
const coseFaqs = [
  { q: 'What is Cosé, and how does it integrate with my existing practice management systems?', a: 'Cose is a full EHR, Scheduler as well as Practice Management system. We also have integrated credentialing and inventory management systems. Cose has an open API that can be integrated with any EHR system, we also accept data through HL7, CSV and other relevant formats. Our software team handles the integration and will utilize the easiest possible option to integrate.' },
  { q: 'Can you describe how Cosé ensures the security and compliance of our patient data?', a: 'HIPAA compliant cloud-based data storage (at rest and in transit). Two Factor Authentication access (Read/Write). SalesForce server security backed by Amazon. Emergency protocols. Strict firewall/permission-based access.' },
  { q: 'What are the key features of Cosé that enhance patient care and billing compliance?', a: 'Billing rules/validations based off Account, Payer, Provider codes (DX, HCPC, CPT), NCCI edits, Diagnosis mapping. Automated workflows based off if/then logic per client specialty and specifications. Patient Portal available for reviewing financials, making payments, medical documentation, intake forms, appointments and Provider communication.' },
  { q: 'How does the cloud-based infrastructure of Cosé improve our practice management?', a: 'Cloud Based interfacing allows for mobile accessibility (single URL products). Relational database reduces efforts in creating and tying in or separating new entities/locations. Fax system integration. Direct tie in from Practice Management to EMR software creates transparency from the front end to the back end. Customize/Dynamic template structure for Patient and Provider documentation. Bi-Directional API Plugins to 3rd party software\'s. Multiple Clearinghouse integrations.' },
  { q: 'What type of real-time data access does Cosé provide, and how can it help in making informed decisions?', a: 'Standardized/Customizable live reports/dashboards measuring key metrics from staff performance to financial trends available at the click of a button. Tools for Denial Management, Rejection Tracking, A/R Management. Clinical data sets such as Patient Population, Diagnosis Tracking, Provider Utilization, Specialty Service specific guidelines, ePrescribe.' },
  { q: 'How user-friendly is the Cosé interface, and what training is required for staff to efficiently use it?', a: 'User friendly interfaces with clear and distinct functions/workflows from Patient Intake to close of accounts. Status based Claim and Appointment tracking.' },
]


/* ───────────────────────────────────────────
   INTERACTIVE 3D WHEEL COMPONENT
   ─────────────────────────────────────────── */

function Interactive360Wheel() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const rotationRef = useRef(0)
  const velocityRef = useRef(0.003)
  const isDragging = useRef(false)
  const lastMouseX = useRef(0)
  const hoveredIndex = useRef(-1)
  const [hovered, setHovered] = useState(-1)
  const [dragging, setDragging] = useState(false)
  const [dimensions, setDimensions] = useState({ w: 560, h: 560 })

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const w = dimensions.w
    const h = dimensions.h
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    const cx = w / 2
    const cy = h / 2
    const outerR = Math.min(w, h) / 2 - 16
    const innerR = outerR * 0.38
    const midR = (outerR + innerR) / 2
    const segCount = wheelSegments.length
    const segAngle = (Math.PI * 2) / segCount

    ctx.clearRect(0, 0, w, h)

    // Outer glow
    const glow = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR + 20)
    glow.addColorStop(0, 'rgba(0,181,214,0.0)')
    glow.addColorStop(0.7, 'rgba(0,181,214,0.03)')
    glow.addColorStop(1, 'rgba(0,181,214,0.08)')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(cx, cy, outerR + 20, 0, Math.PI * 2)
    ctx.fill()

    // Draw segments
    for (let i = 0; i < segCount; i++) {
      const startAngle = rotationRef.current + i * segAngle - Math.PI / 2
      const endAngle = startAngle + segAngle
      const isHov = hoveredIndex.current === i

      // Segment fill
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(startAngle) * innerR, cy + Math.sin(startAngle) * innerR)
      ctx.arc(cx, cy, outerR, startAngle, endAngle)
      ctx.arc(cx, cy, innerR, endAngle, startAngle, true)
      ctx.closePath()

      const segGrad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR)
      if (isHov) {
        segGrad.addColorStop(0, '#00B5D6')
        segGrad.addColorStop(1, '#0090AB')
      } else {
        segGrad.addColorStop(0, i % 2 === 0 ? '#f0fafb' : '#e6f7fa')
        segGrad.addColorStop(1, i % 2 === 0 ? '#e0f4f8' : '#d6eff5')
      }
      ctx.fillStyle = segGrad
      ctx.fill()

      // Segment border
      ctx.strokeStyle = isHov ? '#00B5D6' : 'rgba(0,181,214,0.25)'
      ctx.lineWidth = isHov ? 2.5 : 1
      ctx.stroke()

      // Label
      const labelAngle = startAngle + segAngle / 2
      const labelR = midR + (outerR - innerR) * 0.05
      const lx = cx + Math.cos(labelAngle) * labelR
      const ly = cy + Math.sin(labelAngle) * labelR

      ctx.save()
      ctx.translate(lx, ly)
      ctx.fillStyle = isHov ? '#FFFFFF' : '#333333'
      ctx.font = `${isHov ? '600' : '400'} ${isHov ? 11 : 10}px "Reddit Sans", sans-serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const lines = wheelSegments[i].label.split('\n')
      lines.forEach((line, li) => {
        ctx.fillText(line, 0, (li - (lines.length - 1) / 2) * 14)
      })
      ctx.restore()
    }

    // Center circle
    const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, innerR)
    centerGrad.addColorStop(0, '#00c9e8')
    centerGrad.addColorStop(1, '#00B5D6')
    ctx.beginPath()
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2)
    ctx.fillStyle = centerGrad
    ctx.fill()

    // Center shadow
    ctx.shadowColor = 'rgba(0,181,214,0.3)'
    ctx.shadowBlur = 30
    ctx.beginPath()
    ctx.arc(cx, cy, innerR - 1, 0, Math.PI * 2)
    ctx.fillStyle = 'transparent'
    ctx.fill()
    ctx.shadowBlur = 0
    ctx.shadowColor = 'transparent'

    // Center text
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 16px "Reddit Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('360 DEGREE', cx, cy - 20)
    ctx.fillText('CLOUD', cx, cy + 2)
    ctx.fillText('SOLUTION', cx, cy + 24)

    // Plus badges at top-right and bottom-right
    const plusPositions = [
      { angle: rotationRef.current + 3 * segAngle - Math.PI / 2 + segAngle / 2 },
      { angle: rotationRef.current + 9 * segAngle - Math.PI / 2 + segAngle / 2 },
    ]
    plusPositions.forEach(p => {
      const px = cx + Math.cos(p.angle) * (outerR + 8)
      const py = cy + Math.sin(p.angle) * (outerR + 8)
      ctx.beginPath()
      ctx.arc(px, py, 16, 0, Math.PI * 2)
      ctx.fillStyle = '#00B5D6'
      ctx.fill()
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 18px "Reddit Sans", sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('+', px, py)
    })

    // AI badge at bottom
    const aiAngle = rotationRef.current + 6 * segAngle - Math.PI / 2 + segAngle / 2
    const aix = cx + Math.cos(aiAngle) * (outerR + 8)
    const aiy = cy + Math.sin(aiAngle) * (outerR + 8)
    ctx.beginPath()
    ctx.arc(aix, aiy, 22, 0, Math.PI * 2)
    ctx.fillStyle = '#00B5D6'
    ctx.fill()
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 9px "Reddit Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('AI', aix, aiy - 5)
    ctx.font = '7px "Reddit Sans", sans-serif'
    ctx.fillText('Powered', aix, aiy + 6)
  }, [dimensions])

  const animate = useCallback(() => {
    if (!isDragging.current) {
      rotationRef.current += velocityRef.current
      velocityRef.current += (0.003 - velocityRef.current) * 0.02
    }
    draw()
    animRef.current = requestAnimationFrame(animate)
  }, [draw])

  useEffect(() => {
    const handleResize = () => {
      const container = canvasRef.current?.parentElement
      if (container) {
        const w = Math.min(container.clientWidth, 560)
        setDimensions({ w, h: w })
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animRef.current)
  }, [animate])

  const getSegmentIndex = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    if (!canvas) return -1
    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const cx = dimensions.w / 2
    const cy = dimensions.h / 2
    const dx = x - cx
    const dy = y - cy
    const dist = Math.sqrt(dx * dx + dy * dy)
    const outerR = Math.min(dimensions.w, dimensions.h) / 2 - 16
    const innerR = outerR * 0.38

    if (dist < innerR || dist > outerR) return -1

    let angle = Math.atan2(dy, dx) + Math.PI / 2 - rotationRef.current
    angle = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
    return Math.floor(angle / ((Math.PI * 2) / wheelSegments.length))
  }

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    setDragging(true)
    lastMouseX.current = e.clientX
    velocityRef.current = 0
  }

  const onMouseMove = (e: React.MouseEvent) => {
    const idx = getSegmentIndex(e.clientX, e.clientY)
    if (idx !== hoveredIndex.current) {
      hoveredIndex.current = idx
      setHovered(idx)
    }
    if (isDragging.current) {
      const delta = (e.clientX - lastMouseX.current) * 0.005
      rotationRef.current += delta
      velocityRef.current = delta
      lastMouseX.current = e.clientX
    }
  }

  const onMouseUp = () => { isDragging.current = false; setDragging(false) }
  const onMouseLeave = () => { isDragging.current = false; setDragging(false); hoveredIndex.current = -1; setHovered(-1) }

  // Touch support
  const onTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true
    lastMouseX.current = e.touches[0].clientX
    velocityRef.current = 0
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (isDragging.current) {
      const delta = (e.touches[0].clientX - lastMouseX.current) * 0.005
      rotationRef.current += delta
      velocityRef.current = delta
      lastMouseX.current = e.touches[0].clientX
    }
  }
  const onTouchEnd = () => { isDragging.current = false }

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: 560, margin: '0 auto' }}>
      <canvas
        ref={canvasRef}
        style={{ width: dimensions.w, height: dimensions.h, cursor: dragging ? 'grabbing' : 'grab', touchAction: 'none' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      />
      {hovered >= 0 && hovered < wheelSegments.length && (
        <div style={{
          position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
          background: 'var(--primary)', color: 'white', padding: '8px 20px',
          borderRadius: 'var(--radius-sm)', fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap',
          boxShadow: 'var(--shadow-md)', pointerEvents: 'none',
        }}>
          {wheelSegments[hovered].label.replace('\n', ' ')}
        </div>
      )}
      <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--gray-500)', marginTop: 16 }}>
        Drag to spin · Hover to explore
      </p>
    </div>
  )
}


/* ───────────────────────────────────────────
   FAQ ACCORDION — matches blog card style
   ─────────────────────────────────────────── */

function FAQItem({ q, a, isOpen, onToggle }: { q: string; a: string; isOpen: boolean; onToggle: () => void }) {
  return (
    <div style={{
      marginBottom: 8,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--gray-200)',
      overflow: 'hidden',
      transition: 'border-color 0.2s ease',
      borderColor: isOpen ? '#00B5D6' : 'var(--gray-200)',
    }}>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '18px 24px',
          background: isOpen ? 'var(--primary-ghost)' : 'var(--gray-50)',
          border: 'none', cursor: 'pointer', textAlign: 'left',
          gap: 16, transition: 'background 0.2s ease',
          fontFamily: 'var(--font-body)',
        }}
      >
        <span style={{
          fontSize: 15, fontWeight: 600, color: 'var(--gray-900)',
          lineHeight: 1.5, flex: 1,
        }}>
          {q}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
          viewBox="0 0 24 24" stroke="#00B5D6" strokeWidth={2.5}
          style={{
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform 0.3s ease',
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div style={{ padding: '0 24px 20px', background: 'white' }}>
          <p style={{
            fontSize: 15, lineHeight: 1.75, color: 'var(--gray-600)',
            paddingTop: 12, margin: 0,
          }}>
            {a}
          </p>
        </div>
      )}
    </div>
  )
}

function FAQSection({ title, faqs }: { title: string; faqs: Array<{ q: string; a: string }> }) {
  const [openIndex, setOpenIndex] = useState(-1)

  return (
    <div style={{ marginBottom: 48 }}>
      <h3 style={{
        fontSize: 18, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 16,
        fontFamily: 'var(--font-display)',
      }}>
        {title}
      </h3>
      <div>
        {faqs.map((faq, i) => (
          <FAQItem
            key={i}
            q={faq.q}
            a={faq.a}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
          />
        ))}
      </div>
    </div>
  )
}


/* ───────────────────────────────────────────
   MAIN EHR CONTENT
   ─────────────────────────────────────────── */

export default function EHRContent() {
  return (
    <>
      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '55vh', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
        <video autoPlay muted loop playsInline style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}>
          <source src="/videos/hero-banner.mp4" type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,30,50,0.75) 0%, rgba(0,80,100,0.6) 50%, rgba(0,40,60,0.7) 100%)', zIndex: 1 }} />
        <div className="hero-content" style={{ paddingTop: 160, paddingBottom: 60, position: 'relative', zIndex: 2 }}>
          <MotionReveal>
            <div className="hero-badge"><div className="hero-badge-dot" /><span>EHR & TECHNOLOGY</span></div>
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <h1 style={{ fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 700, fontStyle: 'italic', letterSpacing: '-0.03em', lineHeight: 1.02, color: 'white', marginBottom: 24 }}>
              EHR Agnostic. Seamlessly<br />Integrated.
            </h1>
          </MotionReveal>
          <MotionReveal delay={0.2}>
            <p className="hero-sub" style={{ maxWidth: 680, color: 'rgba(255,255,255,0.85)' }}>
              Works with your existing EHR — Epic, Athenahealth, eClinicalWorks, AdvancedMD, ModMed, nxGen, and more. No migrations. No disruption. For practices that want a purpose-built option, Medcloud supports cleaner claims and faster revenue.
            </p>
          </MotionReveal>
          <MotionReveal delay={0.3}>
            <div className="hero-actions" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn-primary">
                Schedule a Technology Assessment
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
              <Link href="/contact?demo=medcloud" className="btn-ghost" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                Request a Medcloud Demo
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
              </Link>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* ── MEDCLOUD INTRO ── */}
      <section className="section">
        <div className="container">
          <MotionReveal>
            <div>
              <div className="section-label">MEDCLOUD</div>
              <div className="section-title">
                EHR & Practice Management Solutions for Physicians
              </div>
              <p className="section-desc">
                Enter Medcloud, our innovative EHR and Practice Management Software. Designed with your needs in mind, Medcloud integrates seamlessly into your practice, offering a user-friendly interface and cutting-edge features. It&apos;s not just software; it&apos;s a tool that empowers your practice to operate at its peak efficiency.
              </p>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* ── INTERACTIVE 360° DIAGRAM + HIGHLIGHTS ── */}
      <section style={{ padding: '80px 0', background: 'var(--primary)', color: 'white', overflow: 'hidden' }}>
        <div className="container">
          <MotionReveal>
            <h2 style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 300, fontFamily: 'var(--font-display)', marginBottom: 56, lineHeight: 1.3 }}>
              How We Are Enhancing Healthcare Operations:
            </h2>
          </MotionReveal>

          <div className="ehr-ops-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <MotionReveal direction="left">
              <Interactive360Wheel />
            </MotionReveal>

            <MotionReveal direction="right">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <span style={{ fontSize: 24, fontWeight: 700, color: 'white', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>Medcloud</span>
                </div>
                <h3 style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.3, marginBottom: 32 }}>
                  Cutting-edge EHR & Practice Management Software
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                  {medcloudHighlights.map((h, i) => (
                    <div key={i} style={{
                      padding: '16px 24px',
                      background: 'rgba(255,255,255,0.12)',
                      borderLeft: '3px solid rgba(255,255,255,0.5)',
                      fontSize: 16, fontWeight: 400,
                      marginBottom: 8, borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                    }}>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            </MotionReveal>
          </div>
        </div>
      </section>

      {/* ── MEDCLOUD 7 FEATURES ── */}
      <section className="section">
        <div className="container">
          <MotionReveal>
            <div className="section-label">MEDCLOUD</div>
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <div className="section-title">The Future of EHR & Practice Management</div>
          </MotionReveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24, marginTop: 48 }}>
            {medcloudFeatures.map((f, i) => (
              <MotionReveal key={i} direction="scale" delay={0.1 + i * 0.08}>
                <div className="advantage-card" style={{ height: '100%' }}>
                  <div className="advantage-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      {i === 0 && <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />}
                      {i === 1 && <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75L2.25 12l4.179 2.25m0-4.5l5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0L12 17.25 6.43 14.25m11.142 0l4.179 2.25L12 21.75l-9.75-5.25 4.179-2.25" />}
                      {i === 2 && <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />}
                      {i === 3 && <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />}
                      {i === 4 && <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />}
                      {i === 5 && <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />}
                      {i === 6 && <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />}
                    </svg>
                  </div>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPATIBLE SYSTEMS ── */}
      <section className="section section-alt">
        <div className="container">
          <MotionReveal>
            <div className="section-label">COMPATIBLE SYSTEMS</div>
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <div className="section-title">We Connect to What You Already Use</div>
          </MotionReveal>
          <MotionReveal delay={0.2}>
            <p className="section-desc">
              EHR agnostic — integrates with Epic, Athenahealth, eClinicalWorks, AdvancedMD, ModMed, nxGen, ClarityStack, HALOMD, and others. We connect to what you already use.
            </p>
          </MotionReveal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 32 }}>
            {ehrs.map((ehr, i) => (
              <MotionReveal key={i} direction="scale" delay={0.1 + i * 0.05}>
                <span style={{
                  padding: '14px 28px',
                  background: ehr === 'Medcloud' ? 'var(--primary)' : 'var(--white)',
                  color: ehr === 'Medcloud' ? 'white' : 'var(--gray-700)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 15, fontWeight: ehr === 'Medcloud' ? 600 : 400,
                  border: `1px solid ${ehr === 'Medcloud' ? 'var(--primary)' : 'var(--gray-200)'}`,
                  display: 'inline-block',
                  boxShadow: ehr === 'Medcloud' ? 'var(--shadow-glow)' : 'var(--shadow-sm)',
                  transition: 'all var(--transition-base)',
                }}>{ehr}</span>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── KEY CAPABILITIES ── */}
      <section className="section">
        <div className="container">
          <MotionReveal>
            <div className="section-label">KEY CAPABILITIES</div>
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <div className="section-title">Technology That Works for You</div>
          </MotionReveal>
          <MotionReveal delay={0.2}>
            <p className="section-desc">
              Revenue-first design — documentation prompts capture every billable element, supporting accurate coding and maximum reimbursement regardless of which EHR you use. AI-integrated real-time data exchange with Cosentus billing and AI agents enables contextual, accurate patient and payer interactions.
            </p>
          </MotionReveal>
          <div className="advantage-grid" style={{ marginTop: 48 }}>
            {capabilities.map((c, i) => (
              <MotionReveal key={i} direction="scale" delay={0.15 + i * 0.1}>
                <div className="advantage-card">
                  <div className="advantage-icon">{c.icon}</div>
                  <h4>{c.title}</h4>
                  <p>{c.desc}</p>
                </div>
              </MotionReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERSHIP PITCH ── */}
      <section className="section section-alt">
        <div className="container">
          <MotionReveal>
            <div className="section-title">
              Growth with Cosentus: A Partnership for Success
            </div>
          </MotionReveal>
          <MotionReveal delay={0.15}>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--gray-600)' }}>
              Choosing Cosentus means more than just selecting a service provider; it&apos;s a partnership for growth. Our expertise, combined with your passion for healthcare, creates a synergy that propels your practice to new heights. With Cosentus, you&apos;re not just surviving in the healthcare industry; you&apos;re thriving.
            </p>
          </MotionReveal>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="section" id="faq">
        <div className="container">
          <MotionReveal>
            <div className="section-label">FREQUENTLY ASKED QUESTIONS</div>
          </MotionReveal>
          <MotionReveal delay={0.1}>
            <div className="section-title">Frequently Asked Questions</div>
          </MotionReveal>

          <div style={{ marginTop: 48 }}>
            <FAQSection title="EHR Software" faqs={ehrPageFaqs} />
            <FAQSection title="EHR & Practice Management Software — Cosé / Medcloud" faqs={coseFaqs} />
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="cta-section">
        <div className="container">
          <MotionReveal direction="scale">
            <div className="cta-box">
              <h2>See What Your Practice<br />Is Leaving on the Table</h2>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/contact" className="btn-primary">
                  Get Your Free Revenue Analysis
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
                <Link href="/contact?demo=medcloud" className="btn-ghost" style={{ color: 'var(--primary)' }}>
                  Request a Medcloud Demo
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Link>
              </div>
            </div>
          </MotionReveal>
        </div>
      </section>

      {/* ── RESPONSIVE OVERRIDES ── */}
      <style jsx>{`
        @media (max-width: 768px) {
          .ehr-ops-grid {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
      `}</style>
    </>
  )
}
