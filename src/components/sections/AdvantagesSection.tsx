import Image from 'next/image'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

const advantages = [
  { img: '/images/icon-cube.png', title: 'Real + Artificial Intelligence', desc: "Human specialty expertise combined with AI that's purpose-built for your revenue cycle. Cosentus.ai automates eligibility, claims, prior authorizations, scheduling, and patient billing." },
  { img: '/images/icon-doctor.png', title: 'Specialty Expertise', desc: 'Teams organized by specialty — anesthesia, orthopedics, pain management, ASC, and behavioral health. They know every payer nuance and clinical detail.' },
  { img: '/images/icon-partnership.png', title: 'True Partnership', desc: "Independently owned. We manage your practice's financial health as if it were our own. Long-term decisions, not PE pressure." },
  { img: '/images/icon-rcm.png', title: 'Outcome Focused', desc: 'We measure success by the revenue gains we deliver — not vanity metrics. Up to 30% revenue growth and >98% net collection.' },
  { img: '/images/icon-tailored.png', title: 'Tailored Solutions', desc: 'No cookie-cutter packages. Every engagement is designed around your practice — your workflows, your payer mix, your growth goals.' },
  { img: '/images/icon-clarity.png', title: 'Clarity Driven', desc: 'Real-time dashboards, weekly reviews, and same-day reporting. No waiting, no guessing. Full visibility into every dollar.' },
]

function AdvantageCard({ adv }: { adv: typeof advantages[0] }) {
  return (
    <div className="advantage-card">
      <div style={{
        width: 64,
        height: 64,
        borderRadius: 16,
        background: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        flexShrink: 0,
      }}>
        <Image
          src={adv.img}
          alt=""
          width={36}
          height={36}
          style={{ mixBlendMode: 'screen', objectFit: 'contain' }}
        />
      </div>
      <h4>{adv.title}</h4>
      <p>{adv.desc}</p>
    </div>
  )
}

export default function AdvantagesSection() {
  return (
    <section className="section" id="advantage" style={{ overflow: 'hidden' }}>
      <div className="container">
        <RevealOnScroll direction="left">
          <div className="section-label">WHY COSENTUS</div>
        </RevealOnScroll>
        <RevealOnScroll direction="left" delay={0.1}>
          <div className="section-title">The Cosentus Advantage</div>
        </RevealOnScroll>

        {/* Desktop */}
        <div className="advantage-grid advantages-desktop">
          {advantages.map((adv, i) => (
            <RevealOnScroll key={i} direction="scale" delay={0.2 + i * 0.2}>
              <AdvantageCard adv={adv} />
            </RevealOnScroll>
          ))}
        </div>

        {/* Mobile */}
        <div className="advantages-mobile" style={{ overflow: "hidden", width: "100%", marginTop: 32 }}>
          <MobileCarousel autoScrollInterval={4500}>
            {advantages.map((adv, i) => (
              <AdvantageCard key={i} adv={adv} />
            ))}
          </MobileCarousel>
        </div>
      </div>
    </section>
  )
}
