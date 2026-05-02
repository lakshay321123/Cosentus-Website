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
      { label: 'WeCare', href: '/wecare' },
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
    title: 'Services',
    links: [
      { label: 'End-to-End RCM', href: '/services/rcm' },
      { label: 'EHR & Technology', href: '/services/ehr-technology' },
    ],
  },
  {
    title: 'Insights',
    links: [
      { label: 'All Insights', href: '/insights' },
      { label: 'Blog', href: '/blog' },
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
            <Image
              src="/images/cosentus-logo.png"
              alt="Cosentus"
              width={160}
              height={32}
              style={{ height: 32, width: 'auto', filter: 'brightness(0) invert(1)', display: 'block' }}
            />
            <p>
              Real People + AI, RCM Redefined.
            </p>
            <p style={{ marginTop: 12, fontSize: 14, color: 'var(--white)' }}>
              (877) 806-2286 &nbsp;|&nbsp;{' '}
              <a href="mailto:sales@cosentus.com">sales@cosentus.com</a>
            </p>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-end', flexWrap: 'wrap', justifyContent: 'flex-end', gap: 20, marginTop: 24 }}>
              <RevealOnScroll direction="flag">
                <Image
                  src="/gptw-flag.png"
                  alt="Great Place to Work Certified, April 2026 – April 2027, USA"
                  width={258}
                  height={473}
                  style={{ display: 'block', width: 100, height: 'auto' }}
                />
              </RevealOnScroll>
              <Image
                src="/all-accolades-2x3.png"
                alt="Cosentus Accolades, 25 Years of Excellence, AICPA SOC 2, Inc. 5000, HIPAA Seal of Compliance, HIPAA Verified, HBMA Member 2024"
                width={843}
                height={518}
                style={{ mixBlendMode: 'screen', width: 300, maxWidth: '100%', height: 'auto', display: 'block' }}
              />
            </div>
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
