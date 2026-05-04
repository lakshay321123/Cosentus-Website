import { Metadata } from 'next'
import Image from 'next/image'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export const metadata: Metadata = {
  title: 'Careers | Join the Cosentus Team | Irvine, California',
  description:
    'Join the Cosentus team. Independently owned, Great Place to Work certified three years running, and home to teams that change healthcare.',
}

const coreValues = [
  {
    title: 'Be Happy',
    desc:
      "We work hard but have a blast. Positivity is infectious, and while pursuing the goal is always important, it\u2019s equally important to step back and enjoy the journey.",
    icon: '/images/careers/be-happy.png',
  },
  {
    title: 'Be Hungry',
    desc:
      'Great things never get done with \u201Cgood enough\u201D mentalities. We\u2019re not afraid to challenge ideas and always improve. With empowered intention and persistent action, extraordinary things can happen.',
    icon: '/images/careers/be-hungry.png',
  },
  {
    title: 'Be Aware',
    desc:
      "We listen first and respond accordingly. Whether with co-workers or clients, we want to know you for who you really are. We foster integrity and open minds \u2013 you ask, and we\u2019ll follow through.",
    icon: '/images/careers/be-aware.png',
  },
  {
    title: 'Be Focused',
    desc:
      'We plan our work and work our plan. As master organizers, we are always curious, always learning, always becoming experts.',
    icon: '/images/careers/be-focused.png',
  },
  {
    title: 'Be Grateful',
    desc:
      'Gratitude is a verb, not a noun. We show our gratitude and appreciation every day \u2014 to our clients and to each other. We are loyal, supportive, and collaborative. We are one team with one journey.',
    icon: '/images/careers/be-grateful.png',
  },
]

export default function CareersPage() {
  return (
    <main>
      {/* HERO — hands image background. No subtitle, no CTA button: there's
          no contact form to land on yet, so a button would dead-end. */}
      <section className="careers-hero">
        <Image
          src="/images/careers/hero-hands.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          style={{ objectFit: 'cover', objectPosition: 'center' }}
        />
        <div className="careers-hero-overlay" />
        <div className="careers-hero-content">
          <RevealOnScroll>
            <h1>Join Our Team</h1>
          </RevealOnScroll>
        </div>
      </section>

      {/* INSPIRE — kept verbatim per direction */}
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
              style={{
                maxWidth: '100%',
                textAlign: 'center',
                fontSize: 17,
                lineHeight: 1.8,
                marginTop: 24,
              }}
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
              style={{
                maxWidth: '100%',
                textAlign: 'center',
                fontSize: 17,
                lineHeight: 1.8,
                marginTop: 16,
              }}
            >
              Sounds pretty fun, huh? We&rsquo;d love for you to join us on our journey.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      {/* CORE VALUES — full-width staircase. Heading + desc stay inside
          .container; the staircase itself is a sibling outside the
          container so cards span the full viewport. */}
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
              style={{ maxWidth: 720, margin: '20px auto 0', textAlign: 'center' }}
            >
              Our Core Values speak directly to who we are and what we&rsquo;re about &mdash; with them, we build
              universal trust and promise a future of exponential growth.
            </p>
          </RevealOnScroll>
        </div>

        <div className="core-values-list">
          {coreValues.map((v, i) => (
            <RevealOnScroll key={v.title} direction="right" delay={i * 0.18}>
              <div className="core-value-row" data-shade={i % 2 === 0 ? 'a' : 'b'}>
                <div className="core-value-numcol">
                  <span className="core-value-num" aria-hidden="true">{i + 1}</span>
                </div>
                <div className="core-value-card">
                  <div className="core-value-icon">
                    <Image src={v.icon} alt={v.title} width={130} height={130} />
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
      </section>

      {/* CAREER OPPORTUNITIES — simple text + mailto, matches live page */}
      <section className="section">
        <div className="container">
          <RevealOnScroll>
            <h2 className="section-title" style={{ textAlign: 'center' }}>
              Career Opportunities
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="careers-contact">
              <p className="careers-contact-question">Interested in joining the Cosentus team?</p>
              <p className="careers-contact-line">
                E-mail us your resume at{' '}
                <a href="mailto:hr@cosentus.com">hr@cosentus.com</a>
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </main>
  )
}
