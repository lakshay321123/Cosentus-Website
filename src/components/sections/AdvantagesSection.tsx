import Image from 'next/image'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

const advantages = [
  { icon: '/images/icons/3a.png', title: 'Real + Artificial Intelligence', desc: "Human specialty expertise combined with AI that's purpose-built for your revenue cycle. Cosentus.ai automates eligibility, claims, prior authorizations, scheduling, and patient billing." },
  { icon: '/images/icons/c4.png', title: 'Specialty Expertise', desc: 'Teams organized by specialty — anesthesia, orthopedics, pain management, ASC, and behavioral health. They know every payer nuance and clinical detail.', bold: true },
  { icon: '/images/icons/Partnership-Page-3a.png', title: 'True Partnership', desc: "Independently owned. We manage your practice's financial health as if it were our own. Long-term decisions, not PE pressure.", reverse: true },
  { icon: '/images/icons/p3-3a.png', title: 'Outcome Focused', desc: 'We measure success by the revenue gains we deliver — not vanity metrics. Up to 30% revenue growth and >98% net collection.' },
  { icon: '/images/icons/3f.png', title: 'Tailored Solutions', desc: 'No cookie-cutter packages. Every engagement is designed around your practice — your workflows, your payer mix, your growth goals.' },
  { icon: '/images/icons/p3-3e.png', title: 'Clarity Driven', desc: 'Real-time dashboards, weekly reviews, and same-day reporting. No waiting, no guessing. Full visibility into every dollar.' },
]

function AdvantageCard({ adv }: { adv: typeof advantages[0] }) {
  const isBold = 'bold' in adv && adv.bold
  const isReverse = 'reverse' in adv && adv.reverse

  return (
    <div className="advantage-card">
      <div style={{
        width: 64, height: 64, borderRadius: 16,
        background: isReverse ? 'var(--primary)' : 'var(--primary-ghost)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 24, flexShrink: 0,
      }}>
        <Image
          src={adv.icon}
          alt=""
          width={36}
          height={36}
          className={isBold ? '' : isReverse ? 'icon-white' : 'icon-teal'}
          style={{ objectFit: 'contain', ...(isBold ? { mixBlendMode: 'multiply' } : {}) }}
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

        <div className="advantage-grid advantages-desktop">
          {advantages.map((adv, i) => (
            <RevealOnScroll key={i} direction="scale" delay={0.2 + i * 0.2}>
              <AdvantageCard adv={adv} />
            </RevealOnScroll>
          ))}
        </div>

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
