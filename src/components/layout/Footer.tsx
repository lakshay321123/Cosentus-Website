import Link from 'next/link'
import Image from 'next/image'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

const footerNav = [
  {
    title: 'About Us',
    links: [
      { label: 'Our Story', href: '/about' },
      { label: 'Leadership', href: '/about#leadership' },
      { label: 'Cosentus.ai', href: '/cosentus-ai' },
      { label: 'Cosentus Cares', href: '/cosentus-cares' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    title: 'Specialties',
    links: [
      { label: 'Anesthesia', href: '/specialties/anesthesia' },
      { label: 'Orthopedics', href: '/specialties/orthopedics' },
      { label: 'Pain Management', href: '/specialties/pain-management' },
      { label: 'ASCs', href: '/specialties/asc' },
      { label: 'Behavioral Health', href: '/specialties/behavioral-health' },
      { label: 'Multi-Specialty', href: '/specialties/multi-specialty' },
    ],
  },
  {
    // Column 3 — "Services" header with sub-links per Doc 1
    // (May 24 2026, item: "Header of the 3rd column should be
    // Services and below that in the same row it should be RCM
    // 360 and ZeusAi"). Prior layout had this column as a single
    // RCM 360 link with no sub-items.
    title: 'Services',
    links: [
      { label: 'RCM 360', href: '/services/rcm' },
      { label: 'ZeusAi', href: '/cosentus-ai' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'All Resources', href: '/insights' },
      { label: 'Blogs', href: '/blog' },
      { label: 'Client Stories', href: '/case-studies' },
      { label: 'News', href: '/news' },
      { label: 'Events', href: '/events' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <RevealOnScroll direction="flag">
              <Image
                src="/gptw-flag.png"
                alt="Great Place to Work Certified, April 2026 – April 2027, USA"
                width={258}
                height={473}
                className="footer-gptw-img"
                style={{ display: 'block', width: 100, height: 'auto' }}
              />
            </RevealOnScroll>
            <div className="footer-brand-text">
              <Image
                src="/images/cosentus-logo.png"
                alt="Cosentus"
                width={160}
                height={32}
                style={{ height: 32, width: 'auto', filter: 'brightness(0) invert(1)', display: 'block' }}
              />
              <p>
                Real People + Ai, RCM Redefined.
              </p>
              <p style={{ marginTop: 12, fontSize: 14, color: 'var(--white)' }}>
                (877) 806-2286 &nbsp;|&nbsp;{' '}
                <a href="mailto:sales@cosentus.com">sales@cosentus.com</a>
              </p>
            </div>
          </div>

          {/* Accolades strip sits directly under the brand row so the whole
              top block (GPTW + Cosentus brand + accolades) reads as one unit,
              before the nav columns. The source `/all-accolades-single.png`
              is actually a JPEG with a black background, so neither
              `mix-blend-mode: screen` (works only over a solid backdrop, not
              the frosted footer/video on home) nor `filter: brightness(0)
              invert(1)` (turns the entire image into a white rectangle
              because JPEG has no transparency) gave a clean result.
              Instead we serve `/all-accolades-white-transparent.png` — a
              generated PNG with alpha, white pixels for the badge content
              and transparent everywhere else. This renders correctly on
              any backdrop (frosted home footer, solid teal everywhere
              else). */}
          <div className="footer-accolades-strip">
            <Image
              src="/all-accolades-white-transparent.png"
              alt="Cosentus Accolades, 25 Years of Excellence, AICPA SOC 2, Inc. 5000, HIPAA Seal of Compliance, HIPAA Verified, HBMA Member 2024"
              width={1687}
              height={259}
              style={{ width: '100%', maxWidth: 880, height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </div>

          {footerNav.map((col) => (
            <div key={col.title} className="footer-col">
              <h5>{col.title}</h5>
              {col.links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Cosentus. All rights reserved.</p>
          <div className="footer-legal">
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
