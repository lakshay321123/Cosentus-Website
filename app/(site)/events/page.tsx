import { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/sections/PageHero'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Cosentus Events — Healthcare RCM, Medical Billing & AI Solutions',
  description: "There's always something happening at Cosentus. Innovation starts with information. Come say hello!",
}

const events = [
  {
    title: 'ASA® ADVANCE 2026',
    desc: 'Accreda participated in ASA® ADVANCE 2026, held January 23–25, 2026 at the Paris Hotel in Las Vegas, NV. The event brought together anesthesia physician leaders, practice executives, and industry experts to explore advancements in anesthesia care, operations, and revenue cycle performance. During the conference, Cosentus.ai was presented, showcasing how AI-driven intelligence is enhancing visibility, decision-making, and performance across anesthesia revenue cycle management.',
    date: 'January 23–25, 2026',
    location: 'Paris Hotel, Las Vegas, NV',
    tag: 'Conference',
  },
  {
    title: 'Cosentus 25th Anniversary Celebrations',
    desc: "The Cosentus 25th Anniversary Celebrations mark a milestone moment honoring 25 years of growth, innovation, and impact. This special gathering brings our teams together to reflect on our journey, celebrate shared achievements, and recognize the people and partnerships that have shaped Cosentus' success — while looking ahead with pride, purpose, and momentum for the future.",
    date: '2026',
    location: 'Cosentus HQ',
    tag: 'Company',
  },
  {
    title: 'Cosentus Growth Summit 2026',
    desc: 'The Cosentus Growth Summit 2026 is a high-impact, multi-day experience designed to align strategy, ignite innovation, and accelerate growth across teams. Built around the theme "Elevating Performance Together," the summit brings leaders together to collaborate, share insights, and reinforce our commitment to forward momentum, operational excellence, and a unified vision for the future.',
    date: '2026',
    location: 'Multiple Locations',
    tag: 'Summit',
  },
  {
    title: '25 Years of Cosentus Event',
    desc: 'Cosentus celebrated 25 years of growth, innovation, and impact with a vibrant event featuring keynote speeches, live performances, and team recognitions — honoring the people and moments that shaped our journey.',
    date: '2025',
    location: 'Irvine, CA',
    tag: 'Company',
  },
  {
    title: 'Cosentus Growth Summit',
    desc: 'A dynamic 3-day summit focused on aligning vision, sparking innovation, and driving bold growth across teams. Under the theme "Accelerating Cosentus Growth," the event celebrated collaboration, purpose-driven strategy, and our continued commitment to moving forward — together.',
    date: '2025',
    location: 'Multiple Locations',
    tag: 'Summit',
  },
  {
    title: 'HBMA Fall Conference',
    desc: 'Cosentus participated in the HBMA Fall RCM Conference 2025 at Sheraton Niagara Falls, engaging with industry leaders and peers to explore the future of revenue cycle management, operational excellence, and AI in healthcare. The event fostered valuable insights, connections, and conversations shaping the next wave of innovation in healthcare billing and RCM.',
    date: '2025',
    location: 'Sheraton Niagara Falls',
    tag: 'Conference',
  },
]

export default function EventsPage() {
  return (
    <main>
      <PageHero
        label="EVENTS"
        title="There's Always Something Happening at Cosentus."
        subtitle="Innovation starts with information. We attend and host events related to all our service areas, providing the latest and greatest solutions to all your business needs. Come say hello!"
      />

      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {events.map((event, i) => (
              <RevealOnScroll key={i} delay={Math.min(i * 0.08, 0.4)}>
                <article style={{
                  display: 'grid',
                  gridTemplateColumns: '280px 1fr',
                  gap: 40,
                  padding: 36,
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-200)',
                  transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}>
                  {/* Left: Meta */}
                  <div>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 12px',
                      background: 'var(--primary)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 11,
                      fontWeight: 500,
                      color: 'white',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: 16,
                    }}>{event.tag}</span>
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Date</div>
                      <div style={{ fontSize: 15, color: 'var(--gray-800)' }}>{event.date}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Location</div>
                      <div style={{ fontSize: 15, color: 'var(--gray-800)' }}>{event.location}</div>
                    </div>
                  </div>

                  {/* Right: Content */}
                  <div>
                    <h3 style={{ fontSize: 22, fontWeight: 400, color: 'var(--gray-900)', marginBottom: 16, lineHeight: 1.3 }}>
                      {event.title}
                    </h3>
                    <p style={{ fontSize: 15, color: 'var(--gray-600)', lineHeight: 1.7 }}>
                      {event.desc}
                    </p>
                  </div>
                </article>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--primary)', padding: '60px 0', textAlign: 'center' }}>
        <div className="container">
          <RevealOnScroll>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 300, color: 'white', marginBottom: 24 }}>
              Sign Up Today to Meet Our Team and Launch Your Growth Journey
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <Link href="/contact" className="btn-primary" style={{ background: 'white', color: 'var(--primary)' }}>
              Contact Us
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  )
}
