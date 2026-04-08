import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export const metadata: Metadata = {
  title: 'WeCare | Community & Charitable Initiatives | Cosentus',
  description: 'Cosentus is committed to community, employee wellbeing, and the practices we serve. Meet our Impact Ambassadors and the incredible work they do.',
}

const initiatives = [
  {
    name: 'Harmony House — India',
    desc: 'We have been working closely with Harmony House for over 6 years. Harmony House provides education services, healthcare, housing, food, financial support, and vocational training for underprivileged children across India, from ages 6 months to 18 years. With onsite teachers, nannies, cooks, and counselors, Harmony House encourages children to learn, grow, and lead empowered lives. They currently provide for over 600 children and counting.',
    highlight: '600+ children supported',
  },
  {
    name: 'Someone Cares Soup Kitchen',
    desc: 'Cosentus actively contributes to Someone Cares Soup Kitchen, dedicating our efforts to combat hunger by volunteering at this vital community resource. We are committed to providing nutritious food to those in need and fostering a stronger, healthier community.',
    highlight: 'Combating hunger locally',
  },
  {
    name: 'Beyond Blindness',
    desc: 'We support Beyond Blindness in empowering children with visual impairments and other disabilities to achieve their fullest potential.',
    highlight: 'Empowering children',
  },
  {
    name: 'Kids Against Hunger',
    desc: 'We proudly support Kids Against Hunger in their mission to provide nutritious meals to impoverished children and families, helping them move from food insecurity to self-sufficiency.',
    highlight: 'Fighting food insecurity',
  },
  {
    name: 'Save the Children',
    desc: "Cosentus is a proud donor and supporter of Save the Children and its mission to improve the lives of impoverished children around the world.",
    highlight: 'Global child welfare',
  },
  {
    name: 'Child Fund International',
    desc: "Our team members are actively involved with Child Fund's mission to support and sponsor low-income children around the world. Many of our employees happily sponsor individual children and families in various countries, providing school supplies, food, education, housing, and whatever they need to be safe, healthy, and secure.",
    highlight: 'Employee-driven sponsorships',
  },
  {
    name: 'Uday Foundation',
    desc: "We are honored to support the Uday Foundation's efforts in providing medical aid, dignity to the homeless, and disaster relief across India.",
    highlight: 'Medical aid & disaster relief',
  },
  {
    name: "Alzheimer's Association",
    desc: "An annual event in aid of the Alzheimer's Association. Sponsors and volunteers raised over $235,000 — far surpassing their goal of $150,000. We love this opportunity to support an organization that means so much to our team and community.",
    highlight: '$235,000+ raised',
  },
  {
    name: 'Irvine Police Department',
    desc: 'Cosentus sponsors and supports many of the events and initiatives hosted by the Irvine Police Department, including community programs like Concert on the Green and rehabilitation services for officers and service animals.',
    highlight: 'Local community programs',
  },
  {
    name: 'Bill Wilson Center',
    desc: "Cosentus attended the Bill Wilson Center's Building Dreams Celebration, supporting its mission to empower youth and families. The event celebrated community and hope with inspiring stories.",
    highlight: 'Empowering youth & families',
  },
  {
    name: 'In Concert With Hope',
    desc: 'A proud annual partnership supporting hope and community through music and celebration.',
    highlight: 'Annual community event',
  },
  {
    name: 'Orange County Second Harvest Food Bank',
    desc: 'Supporting food distribution and hunger relief across Orange County communities.',
    highlight: 'Local hunger relief',
  },
]

export default function WeCarePage() {
  return (
    <main>
      <PageHero
        label="WECARE"
        title="Come See Our Community Network — And Inspire Change With Us."
        subtitle="At Cosentus, giving back isn't a campaign — it's who we are. Meet our Impact Ambassadors and all the incredible work they do."
      />

      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <RevealOnScroll>
            <p className="section-desc" style={{ maxWidth: '100%', fontSize: 18, lineHeight: 1.8, textAlign: 'center', margin: '0 auto' }}>
              WeCare represents Cosentus&apos;s commitment to community, employee wellbeing, and the practices we serve.
              When practices get paid accurately and on time, they can focus fully on patient care —
              and we can focus on making a difference beyond healthcare.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <div className="section-label">OUR IMPACT</div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="section-title">Community Initiatives</div>
          </RevealOnScroll>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 24,
            marginTop: 48,
          }}>
            {initiatives.map((init, i) => (
              <RevealOnScroll key={i}>
                <div style={{
                  padding: 32,
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--gray-200)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all var(--transition-base)',
                }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '4px 12px',
                    background: 'var(--primary-ghost)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'var(--primary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 16,
                    alignSelf: 'flex-start',
                  }}>
                    {init.highlight}
                  </div>
                  <h4 style={{ fontSize: 18, fontWeight: 400, color: 'var(--gray-900)', marginBottom: 12 }}>
                    {init.name}
                  </h4>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--gray-600)', flex: 1 }}>
                    {init.desc}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <h2>Want to Partner With Us on a Community Initiative?</h2>
            <a href="mailto:wecare@cosentus.com" className="btn-primary">
              Contact WeCare
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  )
}
