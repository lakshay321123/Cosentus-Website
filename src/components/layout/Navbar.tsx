'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const navItems = [
  {
    label: 'About Us',
    href: '/about',
    children: [
      { label: 'Our Story', href: '/about' },
      { label: 'Leadership', href: '/about#leadership' },
      { label: 'Cosentus.ai', href: '/cosentus-ai' },
      { label: 'WeCare', href: '/wecare' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    label: 'Specialties',
    href: '/specialties',
    children: [
      { label: 'Anesthesia', href: '/specialties/anesthesia' },
      { label: 'Orthopedics', href: '/specialties/orthopedics' },
      { label: 'Pain Management', href: '/specialties/pain-management' },
      { label: 'ASCs', href: '/specialties/asc' },
      { label: 'Behavioral Health', href: '/specialties/behavioral-health' },
    ],
  },
  {
    label: 'Services',
    href: '/services',
    children: [
      { label: 'Medical Billing & Coding', href: '/services/billing-coding' },
      { label: 'Complete Practice Management', href: '/services/practice-management' },
      { label: 'Comprehensive RCM', href: '/services/rcm' },
      { label: 'EHR & Technology', href: '/services/ehr-technology' },
    ],
  },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'Blog', href: '/blog' },
      { label: 'Case Studies', href: '/case-studies' },
      { label: 'News', href: '/news' },
      { label: 'Events', href: '/events' },
      { label: 'Partnership', href: '/partnership' },
    ],
  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
      <div className="nav-inner">
        <Link href="/" className="nav-logo">
          <Image
            src="/images/cosentus-logo.png"
            alt="Cosentus"
            width={200}
            height={38}
            style={{
              height: scrolled ? 32 : 38,
              width: 'auto',
              filter: scrolled ? 'none' : 'brightness(0) invert(1)',
              transition: 'all 0.3s ease',
            }}
            priority
          />
        </Link>

        <ul className={`nav-links${mobileOpen ? ' active' : ''}`} id="navLinks">
          {navItems.map((item) => (
            <li key={item.label} className={item.children ? 'has-dropdown' : ''}>
              <Link href={item.href}>{item.label}</Link>
              {item.children && (
                <div className="dropdown">
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
          <li>
            <Link href="/contact" className="nav-cta">
              Contact
            </Link>
          </li>
        </ul>

        <button
          className="nav-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}
