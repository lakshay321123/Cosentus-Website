import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

const advantages = [
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>, title: 'Real + Artificial Intelligence', desc: "Human specialty expertise combined with AI that's purpose-built for your revenue cycle. Cosentus.ai automates eligibility, claims, prior authorizations, scheduling, and patient billing." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>, title: 'Specialty Expertise', desc: 'Teams organized by specialty — anesthesia, orthopedics, pain management, ASC, and behavioral health. They know every payer nuance and clinical detail.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, title: 'True Partnership', desc: "Independently owned. We manage your practice's financial health as if it were our own. Long-term decisions, not PE pressure." },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>, title: 'Outcome Focused', desc: 'We measure success by the revenue gains we deliver — not vanity metrics. Up to 30% revenue growth and >98% net collection.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>, title: 'Tailored Solutions', desc: 'No cookie-cutter packages. Every engagement is designed around your practice — your workflows, your payer mix, your growth goals.' },
  { icon: <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>, title: 'Clarity Driven', desc: 'Real-time dashboards, weekly reviews, and same-day reporting. No waiting, no guessing. Full visibility into every dollar.' },
]

function AdvantageCard({ adv }: { adv: typeof advantages[0] }) {
  return (
    <div className="advantage-card">
      <div className="advantage-icon">{adv.icon}</div>
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
