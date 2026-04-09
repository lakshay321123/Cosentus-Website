import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

export const metadata: Metadata = {
  title: 'Complete Practice Management Services | Cosentus',
  description: 'Front desk to credentialing, reporting, and consulting — so your clinical team focuses on patients.',
}

const services = [
  { title: 'Front Desk Optimization', desc: 'Scheduling, intake, insurance verification, and co-pay collection; yields 5–15% additional revenue in many practices.', img: '/images/icons/p3-3d.png' },
  { title: 'Financial Performance Reporting', desc: 'Practice-level dashboards, cash-flow visibility, and revenue performance tracking.', img: '/images/icons/p3-3e.png' },
  { title: 'Credentialing Services', desc: 'Provider credentialing and re-credentialing with major payers.', img: '/images/icons/p3-3d.png' },
  { title: 'Operational Consulting', desc: 'Staffing optimization, workflow analysis and growth planning.', img: '/images/icons/3f.png' },
  { title: 'Reporting & Visibility', desc: 'Real-time dashboards and weekly performance reviews.', img: '/images/icons/p3-3e.png' },
]

export default function PracticeManagementPage() {
  return (
    <main>
      <PageHero
        label="COMPLETE PRACTICE MANAGEMENT"
        title="Run a More Profitable Practice Without Adding to Your Workload."
        subtitle="We manage the operational complexity of running a medical practice — front desk to credentialing, reporting, and consulting — so your clinical team focuses on patients."
        ctaText="Get Your Free Practice Assessment"
        ctaHref="/contact"
      />

      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">WHAT WE MANAGE</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Everything Behind the Scenes</div>
          </RevealOnScroll>
          <div className="advantage-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 48 }}>
            {services.map((s, i) => (
              <RevealOnScroll key={i}>
                <div className="advantage-card">
                  <div className="advantage-icon"><Image src={s.img} alt="" width={28} height={28} className="icon-teal" style={{ objectFit: 'contain' }} /></div>
                  <h4>{s.title}</h4>
                  <p>{s.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll>
            <div className="section-label">WHY OUTSOURCE</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Why Outsource Practice Management</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 17, lineHeight: 1.8 }}>
              Reduce administrative overhead, improve front-end revenue capture, and gain predictable financial performance. Your clinical team stays focused on patients while we handle operations, reporting, and growth.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <CTASection />
    </main>
  )
}
