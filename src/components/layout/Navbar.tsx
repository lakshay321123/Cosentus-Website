'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

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
      { label: 'Case Studies', href: '/resources' },
      { label: 'News', href: '/news' },
      { label: 'Events', href: '/events' },
      { label: 'Partnership', href: '/partnership' },
    ],
  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setExpandedMenu(null)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const closeMenu = () => {
    setMobileOpen(false)
    setExpandedMenu(null)
  }

  const toggleSubmenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label)
  }

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
      <div className="nav-inner">
        <Link href="/" className="nav-logo" onClick={closeMenu}>
          <Image
            src="/images/cosentus-logo.png"
            alt="Cosentus"
            width={200}
            height={38}
            style={{
              height: scrolled ? 32 : 38,
              width: 'auto',
              filter: (scrolled && !mobileOpen) ? 'none' : 'brightness(0) invert(1)',
              transition: 'all 0.3s ease',
            }}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <ul className={`nav-links${mobileOpen ? ' active' : ''}`}>
          {navItems.map((item) => (
            <li key={item.label} className={`${item.children ? 'has-dropdown' : ''}${expandedMenu === item.label ? ' expanded' : ''}`}>
              {/* On mobile: tap to expand/collapse submenu */}
              <a
                href={item.href}
                onClick={(e) => {
                  if (item.children && window.innerWidth <= 768) {
                    e.preventDefault()
                    toggleSubmenu(item.label)
                  } else {
                    closeMenu()
                  }
                }}
                className="nav-parent-link"
              >
                {item.label}
                {item.children && (
                  <svg className="mobile-chevron" xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                    style={{ transform: expandedMenu === item.label ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </a>
              {item.children && (
                <div className={`dropdown${expandedMenu === item.label ? ' mobile-expanded' : ''}`}>
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href} onClick={closeMenu}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
          <li>
            <Link href="/contact" className="nav-cta-mobile" onClick={closeMenu}>
              Contact Us
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger / X toggle */}
        <button
          className={`nav-toggle${mobileOpen ? ' open' : ''}`}
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
