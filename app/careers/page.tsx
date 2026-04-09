import { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/sections/PageHero'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import MobileCarousel from '@/components/ui/MobileCarousel'

export const metadata: Metadata = {
  title: 'Careers | Join the Cosentus Team | Irvine, California',
  description: 'Build a career that changes healthcare. Great Place to Work certified three years running.',
}

const reasons = [
  { title: 'Independently owned', desc: 'Long-term decisions made for the right reasons, not quarterly investor returns.' },
  { title: 'Great Place to Work certified', desc: 'Three consecutive years, with 99% customer retention built on team stability.' },
  { title: 'Specialty-focused careers', desc: "You'll become a genuine expert in a specialty domain, not a generalist." },
  { title: 'Growth from within', desc: '80% of our founding leadership team is still here. We invest in people for the long run.' },
  { title: 'Mission-driven', desc: 'When practices get paid accurately and on time, they can focus fully on patient care.' },
]

export default function CareersPage() {
  return (
    <main>
      <PageHero
        label="CAREERS"
        title="Build a Career That Changes Healthcare."
        subtitle="Independently owned. Great Place to Work certified three years running. Join a team redefining billing excellence — for practices, for patients, and for each other."
      />

      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">WHY COSENTUS</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Why Join Us</div>
          </RevealOnScroll>

          <div className="advantage-grid advantages-desktop" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: 48 }}>
            {reasons.map((r, i) => (
              <RevealOnScroll key={i}>
                <div className="advantage-card">
                  <h4>{r.title}</h4>
                  <p>{r.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
          <div className="advantages-mobile" style={{ overflow: 'hidden', width: '100%', marginTop: 32 }}>
            <MobileCarousel autoScrollInterval={4500}>
              {reasons.map((r, i) => (
                <div key={i} className="advantage-card">
                  <h4>{r.title}</h4>
                  <p>{r.desc}</p>
                </div>
              ))}
            </MobileCarousel>
          </div>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container" style={{ textAlign: 'center' }}>
          <RevealOnScroll>
            <div className="section-title">Open Roles</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="section-desc" style={{ margin: '20px auto 40px', textAlign: 'center' }}>
              We&apos;re always looking for talented people. Send us your CV and we&apos;ll get back to you.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <Link
              href="mailto:hr@cosentus.com?subject=Job%20Application%20%E2%80%94%20Please%20see%20attached%20CV%2FResume&body=Dear%20HR%20Team%2C%0A%0AI%20am%20interested%20in%20joining%20the%20Cosentus%20team.%20Please%20find%20my%20CV%2FResume%20attached%20for%20your%20consideration.%0A%0AI%20look%20forward%20to%20hearing%20from%20you.%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D"
              className="btn-primary"
            >
              Join Our Team
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  )
}
