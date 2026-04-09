import Image from 'next/image'
import Link from 'next/link'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
  </svg>
)

const services = [
  { icon: '/images/icons/p3-3b.png', title: 'Medical Billing & Coding', desc: 'Specialty-trained coders and billers. End-to-end claim submission, denial management, appeals, and follow-up — 98.5% coding accuracy and >99% clean claim rates.', href: '/services/billing-coding' },
  { icon: '/images/icons/p3-3d.png', title: 'Complete Practice Management', desc: 'Front desk operations, credentialing, scheduling, financial counseling, and operational support — so your team can focus on patients.', href: '/services/practice-management' },
  { icon: '/images/icons/3a.png', title: 'EHR & Technology', desc: 'EHR agnostic — seamlessly integrated with your existing systems. Or upgrade to Medcloud for real-time analytics and AI-powered workflows.', href: '/services/ehr-technology' },
  { icon: '/images/icons/p3-3c.png', title: 'Comprehensive RCM', desc: 'The full revenue cycle managed end-to-end: eligibility, coding, submission, denials, payments, patient collections, and reporting.', href: '/services/rcm' },
]

function ServiceCard({ svc }: { svc: typeof services[0] }) {
  return (
    <div className="service-card">
      <div className="service-icon"><Image src={svc.icon} alt="" width={28} height={28} className="icon-teal" style={{ objectFit: 'contain' }} /></div>
      <h4>{svc.title}</h4>
      <p>{svc.desc}</p>
      <Link href={svc.href} className="service-link">
        Learn More <ArrowIcon />
      </Link>
    </div>
  )
}

export default function ServicesSection() {
  return (
    <section className="section section-alt" id="services" style={{ overflow: 'hidden' }}>
      <div className="container">
        <RevealOnScroll direction="right">
          <div className="section-label">WHAT WE DO</div>
        </RevealOnScroll>
        <RevealOnScroll direction="right" delay={0.1}>
          <div className="section-title">Services Built Around<br />Your Practice</div>
        </RevealOnScroll>

        {/* Desktop */}
        <div className="services-grid services-desktop">
          {services.map((svc, i) => (
            <RevealOnScroll key={i} delay={0.2 + i * 0.25}>
              <ServiceCard svc={svc} />
            </RevealOnScroll>
          ))}
        </div>

        {/* Mobile */}
        <div className="services-mobile" style={{ overflow: "hidden", width: "100%", marginTop: 32 }}>
          <MobileCarousel autoScrollInterval={5000}>
            {services.map((svc, i) => (
              <ServiceCard key={i} svc={svc} />
            ))}
          </MobileCarousel>
        </div>
      </div>
    </section>
  )
}
