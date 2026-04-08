import { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/sections/PageHero'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Healthcare RCM Partnership Solutions — Partner With Cosentus',
  description: 'Cosentus has emerged as the preferred partner of choice for billing companies across America. 1,000+ RCM experts, cutting-edge AI, and 19 successful acquisitions.',
}

const partnerQuotes = [
  { quote: 'We are very excited to be a part of the Cosentus family. We see such a strategic fit amongst the teams and are ready to unlock all of the combined potential.', author: 'Alex Cushman', title: 'CEO, AllianceMed' },
  { quote: "We are proud of the company we've built and excited to join forces with Cosentus. Together, we'll have the resources, technology, & expertise to provide even greater value to the healthcare providers we serve.", author: 'Brandon Jones', title: 'CEO, Alta Management Solutions, LLC' },
  { quote: 'Cosentus made the acquisition of North Medical Billing seamless, delivering on every promise and exceeding expectations. Professional, efficient, and trustworthy, they turned a business relationship into a lasting friendship. Highly recommend!', author: 'Doug North', title: 'Founder & Former Owner, North Medical Billing' },
  { quote: 'We are excited to play an even bigger role in the world of RCM and healthcare consulting, with an expanded team that is poised to provide unmatched outcomes.', author: 'Arthur Roosa', title: 'CEO and founder of SyMed' },
  { quote: 'Together with Cosentus, our clients will benefit from cutting-edge technology, deeper analytics, and a partnership model that truly understands and drives their financial success.', author: 'Logan Lowry', title: 'Co-Founder and President of Accreda' },
]

const challenges = [
  'Scaling operations without losing quality or client relationships',
  'Keeping pace with technology and AI advancements',
  'Managing rising costs while maintaining profitability',
  'Competing against private equity-backed consolidators',
]

const solutions = [
  { title: '25 Years in Revenue Cycle Management', desc: 'Successfully integrated 19 acquisitions — we know how to grow together.' },
  { title: 'Upfront Capital Investments', desc: 'De-risk the owners, providing financial security and runway for growth.' },
  { title: 'Comprehensive Solutions', desc: 'Offshore teams, advanced technology platforms, AI software, and dedicated support.' },
  { title: 'Transformative Offshoring & Tech', desc: 'Enhance efficiency, reduce costs, and improve service delivery at scale.' },
]

export default function PartnershipPage() {
  return (
    <main>
      <PageHero
        label="PARTNERSHIP"
        title="Grow Your Business with Innovative Solutions"
        subtitle="Cosentus has emerged as the preferred partner of choice for billing companies across America. Our dedicated team of 1,000+ RCM experts ensures cost-effectiveness and maximized operational efficiencies."
        ctaText="Schedule a Call"
        ctaHref="/contact"
      />

      {/* Intro */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <RevealOnScroll>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 17, lineHeight: 1.8 }}>
              With AI software and outsourcing capabilities, we are one of the largest non-private equity-backed RCM companies in America. Our integrated services approach has fostered several long-term partnerships. As an organization, we have consistently ranked as one of the Fastest Growing Companies in the US by Inc. 5000, and have been certified by Great Place to Work for three consecutive years.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Partner Testimonials */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll direction="left">
            <div className="section-label">PARTNER PERSPECTIVES</div>
          </RevealOnScroll>
          <RevealOnScroll direction="left" delay={0.1}>
            <div className="section-title">Our Partner&apos;s Perspective</div>
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24, marginTop: 48 }}>
            {partnerQuotes.map((q, i) => (
              <RevealOnScroll key={i} direction="scale" delay={i * 0.08}>
                <div style={{ padding: 32, background: 'var(--white)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <p style={{ fontSize: 15, fontStyle: 'italic', color: 'var(--gray-700)', lineHeight: 1.7, flex: 1, marginBottom: 20 }}>&ldquo;{q.quote}&rdquo;</p>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-900)' }}>{q.author}</p>
                    <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>{q.title}</p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">COMMON CHALLENGES</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Is Your Journey to Growth Facing These Challenges?</div>
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginTop: 40 }}>
            {challenges.map((c, i) => (
              <RevealOnScroll key={i} delay={i * 0.1}>
                <div style={{ padding: 28, background: 'var(--primary-ghost)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', fontSize: 16, color: 'var(--gray-700)', lineHeight: 1.6 }}>
                  {c}
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Think Growth Solutions */}
      <section style={{ background: 'var(--primary)', padding: '80px 0' }}>
        <div className="container">
          <RevealOnScroll>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 300, fontStyle: 'italic', color: 'white', textAlign: 'center', marginBottom: 48 }}>THINK GROWTH</h2>
          </RevealOnScroll>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {solutions.map((s, i) => (
              <RevealOnScroll key={i} delay={i * 0.1}>
                <div style={{ padding: 28, background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center', height: '100%' }}>
                  <h4 style={{ fontSize: 16, fontWeight: 500, color: 'white', marginBottom: 10 }}>{s.title}</h4>
                  <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: 700 }}>
          <RevealOnScroll>
            <div className="section-title">Partner with Cosentus</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="section-desc" style={{ maxWidth: '100%', textAlign: 'center', margin: '0 auto 40px' }}>
              At Cosentus, we understand the unique challenges faced by medical billing companies. Our tailored solutions and innovative approach ensure that our partners can overcome these hurdles and achieve sustainable growth. By partnering with us, you gain access to our extensive resources, expertise, and a network dedicated to excellence in RCM.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <Link href="/contact" className="btn-primary">
              I Would Like to Know More
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  )
}
