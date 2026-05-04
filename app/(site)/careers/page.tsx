import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import PageHero from '@/components/sections/PageHero'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Careers | Join the Cosentus Team | Irvine, California',
  description: 'Build a career that changes healthcare. Great Place to Work certified three years running.',
}

const coreValues = [
  {
    title: 'Be Happy',
    desc: "We work hard but have a blast. Positivity is infectious, and while pursuing the goal is always important, it's equally important to step back and enjoy the journey.",
    icon: '/images/careers/be-happy.png',
  },
  {
    title: 'Be Hungry',
    desc: 'Great things never get done with "good enough" mentalities. We\u2019re not afraid to challenge ideas and always improve. With empowered intention and persistent action, extraordinary things can happen.',
    icon: '/images/careers/be-hungry.png',
  },
  {
    title: 'Be Aware',
    desc: "We listen first and respond accordingly. Whether with co-workers or clients, we want to know you for who you really are. We foster integrity and open minds \u2013 you ask, and we\u2019ll follow through.",
    icon: '/images/careers/be-aware.png',
  },
  {
    title: 'Be Focused',
    desc: 'We plan our work and work our plan. As master organizers, we are always curious, always learning, always becoming experts.',
    icon: '/images/careers/be-focused.png',
  },
  {
    title: 'Be Grateful',
    desc: 'Gratitude is a verb, not a noun. We show our gratitude and appreciation every day \u2014 to our clients and to each other. We are loyal, supportive, and collaborative. We are one team with one journey.',
    icon: '/images/careers/be-grateful.png',
  },
]

const APPLY_INTERNAL = 'https://cosentustalent.catsone.com/careers/45627-Cosentus-Careers/'
const APPLY_CLIENT = 'https://cosentustalent.catsone.com/careers/54390-Client-Posting-Portal/'
const HR_MAILTO =
  'mailto:hr@cosentus.com?subject=Job%20Application%20%E2%80%94%20Please%20see%20attached%20CV%2FResume&body=Dear%20HR%20Team%2C%0A%0AI%20am%20interested%20in%20joining%20the%20Cosentus%20team.%20Please%20find%20my%20CV%2FResume%20attached%20for%20your%20consideration.%0A%0AI%20look%20forward%20to%20hearing%20from%20you.%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D'

export default function CareersPage() {
  return (
    <main>
      <PageHero
        label="CAREERS"
        title="Join Our Team"
        subtitle="Independently owned. Great Place to Work certified three years running. Join a team redefining billing excellence — for practices, for patients, and for each other."
        ctaText="Apply Now"
        ctaHref="#career-opportunities"
      />

      {/* Inspire tagline + DNA copy */}
      <section className="section">
        <div className="container" style={{ maxWidth: 880 }}>
          <RevealOnScroll>
            <h2 className="section-title" style={{ textAlign: 'center' }}>
              We inspire each other. Inspire with us.
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p
              className="section-desc"
              style={{ maxWidth: '100%', textAlign: 'center', fontSize: 17, lineHeight: 1.8, marginTop: 24 }}
            >
              Collaboration, coordination, and cooperation are at the core of the Cosentus DNA. We build on each
              other&rsquo;s ideas to innovate and inspire. We revolutionize business &mdash; but a revolution requires
              people. All sorts of people, with all sorts of talents and skills. People are at the center of everything
              we do, and our people are wildly talented, fun, and experts in their field. They are the ready
              responders, the problem-solvers, the dreamers and doers.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p
              style={{
                textAlign: 'center',
                fontStyle: 'italic',
                fontWeight: 600,
                fontSize: 18,
                color: 'var(--primary)',
                marginTop: 28,
              }}
            >
              Together we concoct ingenious business solutions.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.25}>
            <p
              className="section-desc"
              style={{ maxWidth: '100%', textAlign: 'center', fontSize: 17, lineHeight: 1.8, marginTop: 16 }}
            >
              Sounds pretty fun, huh? We&rsquo;d love for you to join us on our journey.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* Core Values */}
      <section className="section section-alt">
        <div className="container">
          <RevealOnScroll>
            <h2 className="section-title" style={{ textAlign: 'center' }}>
              Our Core Values
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p
              className="section-desc"
              style={{ maxWidth: 720, margin: '20px auto 60px', textAlign: 'center' }}
            >
              Our Core Values speak directly to who we are and what we&rsquo;re about &mdash; with them, we build
              universal trust and promise a future of exponential growth.
            </p>
          </RevealOnScroll>

          <div className="core-values-list">
            {coreValues.map((v, i) => (
              <RevealOnScroll key={i} direction="right" delay={i * 0.18}>
                <div className="core-value-row" data-step={i + 1}>
                  <div className="core-value-num" aria-hidden="true">
                    {i + 1}
                  </div>
                  <div className="core-value-card">
                    <div className="core-value-icon">
                      <Image src={v.icon} alt={v.title} width={120} height={120} />
                    </div>
                    <div className="core-value-body">
                      <h3 className="core-value-title">{v.title}</h3>
                      <p className="core-value-desc">{v.desc}</p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Career Opportunities */}
      <section id="career-opportunities" className="section">
        <div className="container">
          <RevealOnScroll>
            <h2 className="section-title" style={{ textAlign: 'center' }}>
              Career Opportunities
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="section-desc" style={{ maxWidth: 640, margin: '20px auto 48px', textAlign: 'center' }}>
              Interested in joining the Cosentus team? Apply through one of our portals below, or email your resume
              directly to{' '}
              <a href={HR_MAILTO} style={{ color: 'var(--primary)', fontWeight: 500 }}>
                hr@cosentus.com
              </a>
              .
            </p>
          </RevealOnScroll>

          <div className="careers-cta-grid">
            <RevealOnScroll delay={0.15}>
              <div className="careers-cta-card">
                <h3 className="careers-cta-title">Internal Positions</h3>
                <p className="careers-cta-desc">
                  Want to join the Cosentus team? Check out our internal positions across billing, coding, operations,
                  and leadership.
                </p>
                <Link href={APPLY_INTERNAL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Apply Now
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </RevealOnScroll>
            <RevealOnScroll delay={0.25}>
              <div className="careers-cta-card">
                <h3 className="careers-cta-title">Client Opportunities</h3>
                <p className="careers-cta-desc">
                  Not finding the right opportunity here? Check out roles posted by our partner practices and clients.
                </p>
                <Link href={APPLY_CLIENT} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Apply Now
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>
    </main>
  )
}
