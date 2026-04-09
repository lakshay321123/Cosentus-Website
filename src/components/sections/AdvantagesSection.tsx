import Image from 'next/image'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

const advantages = [
  { img: '/images/icon-cube.png', title: 'Real + Artificial Intelligence', desc: "Human specialty expertise combined with AI that's purpose-built for your revenue cycle. Cosentus.ai automates eligibility, claims, prior authorizations, scheduling, and patient billing." },
  { img: '/images/icon-doctor.png', title: 'Specialty Expertise', desc: 'Teams organized by specialty — anesthesia, orthopedics, pain management, ASC, and behavioral health. They know every payer nuance and clinical detail.' },
  { svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="30" height="30"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" /></svg>, title: 'True Partnership', desc: "Independently owned. We manage your practice's financial health as if it were our own. Long-term decisions, not PE pressure." },
  { img: '/images/icon-rcm.png', title: 'Outcome Focused', desc: 'We measure success by the revenue gains we deliver — not vanity metrics. Up to 30% revenue growth and >98% net collection.' },
  { svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="30" height="30"><path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" /></svg>, title: 'Tailored Solutions', desc: 'No cookie-cutter packages. Every engagement is designed around your practice — your workflows, your payer mix, your growth goals.' },
  { svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="30" height="30"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" /></svg>, title: 'Clarity Driven', desc: 'Real-time dashboards, weekly reviews, and same-day reporting. No waiting, no guessing. Full visibility into every dollar.' },
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
        color: 'white',
        flexShrink: 0,
      }}>
        {adv.img ? (
          <Image
            src={adv.img}
            alt=""
            width={36}
            height={36}
            style={{ mixBlendMode: 'screen', objectFit: 'contain' }}
          />
        ) : (
          adv.svg
        )}
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
