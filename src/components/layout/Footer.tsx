import Link from 'next/link'
import Image from 'next/image'

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
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'News', href: '/news' },
      { label: 'Events', href: '/events' },
      { label: 'Contact', href: '/contact' },
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
              style={{ height: 32, width: 'auto', filter: 'brightness(0) invert(1)' }}
            />
            <p>
              Cut Through the Noise. AI-Native RCM That Delivers.
            </p>
            <p style={{ marginTop: 12, fontSize: 14, color: 'var(--white)' }}>
              (877) 806-2286 &nbsp;|&nbsp;{' '}
              <a href="mailto:sales@cosentus.com">sales@cosentus.com</a>
            </p>
            <div style={{ marginTop: 20 }}>
              <Image
                src="/accolades.png"
                alt="Cosentus Accolades — 25 Years of Excellence, Great Place to Work, HIPAA Seal of Compliance, HIPAA Verified, Inc. 5000, AICPA SOC 2, HBMA Member 2024"
                width={360}
                height={100}
                style={{ mixBlendMode: 'screen', maxWidth: 360, width: '100%', height: 'auto' }}
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
