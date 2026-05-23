'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
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
      { label: 'Multi-Specialty', href: '/specialties/multi-specialty' },
    ],
  },
  {
    label: 'RCM 360',
    href: '/services/rcm',
  },
  {
    label: 'Resources',
    href: '/insights',
    children: [
      { label: 'Blog', href: '/blog' },
      { label: 'Client Stories', href: '/case-studies' },
      { label: 'News', href: '/news' },
      { label: 'Events', href: '/events' },
    ],
  },
  {
    // Partnership promoted out of the Resources dropdown to its own
    // top-level tab per user direction May 2026. Placed between
    // Resources and Zeus Ai so Zeus Ai keeps the featured rightmost
    // slot, and Partnership sits next to the other supporting-content
    // tabs rather than competing with the AI product position.
    label: 'Partnership',
    href: '/partnership',
  },
  {
    label: 'Zeus Ai',
    href: '/cosentus-ai',
  },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [flagDismissed, setFlagDismissed] = useState(false)
  const pathname = usePathname()

  // Swipe-to-close state
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)
  const touchCurrentX = useRef(0)
  const drawerRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)

  // Trigger the GPTW flag drop-down on the next paint after mount.
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setMounted(true))
    return () => window.cancelAnimationFrame(id)
  }, [])

  // Auto-retract the GPTW flag 7s after first render. Stays retracted for the
  // rest of the session — does not re-drop on scroll-to-top once dismissed.
  useEffect(() => {
    const id = window.setTimeout(() => setFlagDismissed(true), 7000)
    return () => window.clearTimeout(id)
  }, [])

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false)
    setExpandedMenu(null)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false)
    setExpandedMenu(null)
  }, [])

  const toggleSubmenu = (label: string) => {
    setExpandedMenu(expandedMenu === label ? null : label)
  }

  // Swipe-to-close handlers on the drawer panel
  const onDrawerTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchCurrentX.current = e.touches[0].clientX
    isDragging.current = false
  }

  const onDrawerTouchMove = (e: React.TouchEvent) => {
    touchCurrentX.current = e.touches[0].clientX
    const deltaX = touchCurrentX.current - touchStartX.current
    const deltaY = e.touches[0].clientY - (touchStartY.current || e.touches[0].clientY)
    // Only start dragging if horizontal movement > vertical (intentional swipe)
    if (!isDragging.current && Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
      isDragging.current = true
    }
    if (isDragging.current && deltaX < 0) {
      if (drawerRef.current) {
        drawerRef.current.style.transition = 'none'
        drawerRef.current.style.transform = `translateX(${Math.min(0, deltaX)}px)`
      }
    }
  }

  const onDrawerTouchEnd = () => {
    const delta = touchCurrentX.current - touchStartX.current
    if (drawerRef.current) {
      drawerRef.current.style.transition = ''
      drawerRef.current.style.transform = ''
    }
    if (isDragging.current && delta < -80) {
      closeDrawer()
    }
    isDragging.current = false
  }

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          {/* Hamburger, mobile only */}
          <button
            className="drawer-toggle"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
          >
            <span /><span /><span />
          </button>

          <Link href="/" className="nav-logo" onClick={closeDrawer}>
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
            {/* GPTW flag drops down from the cosentus logo on mount; rolls back up on scroll past 60px or after 7s (whichever first). Once dismissed, stays up for the session. */}
            <span className={`nav-gptw-flag${mounted && !scrolled && !flagDismissed ? ' visible' : ''}`} aria-hidden="true">
              <Image
                src="/gptw-flag.png"
                alt=""
                width={258}
                height={473}
                priority
              />
            </span>
          </Link>

          {/* Desktop nav links */}
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.label} className={item.children ? 'has-dropdown' : ''}>
                <Link href={item.href}>{item.label}</Link>
                {item.children && (
                  <div className="dropdown">
                    {item.children.map((child) => (
                      <Link key={child.href} href={child.href}>{child.label}</Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
            <li>
            <Link href="/contact" className="nav-cta">Contact</Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* ===== MOBILE DRAWER ===== */}
      {/* Overlay */}
      <div
        className={`drawer-overlay${drawerOpen ? ' open' : ''}`}
        onClick={closeDrawer}
      />

      {/* Drawer panel */}
      <div
        ref={drawerRef}
        className={`drawer-panel${drawerOpen ? ' open' : ''}`}
        onTouchStart={onDrawerTouchStart}
        onTouchMove={onDrawerTouchMove}
        onTouchEnd={onDrawerTouchEnd}
      >
        {/* Drawer header */}
        <div className="drawer-header">
          <Image
            src="/images/cosentus-logo.png"
            alt="Cosentus"
            width={160}
            height={30}
            style={{ height: 28, width: 'auto', filter: 'none' }}
          />
          <button className="drawer-close" onClick={closeDrawer} aria-label="Close menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer nav items */}
        <nav className="drawer-nav">
          {navItems.map((item) => (
            <div key={item.label} className="drawer-section">
              {!item.children ? (
                <Link
                  className="drawer-parent"
                  href={item.href}
                  onClick={closeDrawer}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  className={`drawer-parent${expandedMenu === item.label ? ' expanded' : ''}`}
                  onClick={() => toggleSubmenu(item.label)}
                >
                  <span>{item.label}</span>
                  <svg className="drawer-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
              {item.children && (
                <div className={`drawer-children${expandedMenu === item.label ? ' expanded' : ''}`}>
                  {item.children.map((child) => (
                    <Link key={child.href} href={child.href} onClick={closeDrawer} className="drawer-child">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Drawer CTA */}
        <div className="drawer-footer">
          <Link href="/contact" onClick={closeDrawer} className="drawer-cta">
            Contact Us
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a href="tel:8778062286" className="drawer-phone">(877) 806-2286</a>
        </div>
      </div>
    </>
  )
}
