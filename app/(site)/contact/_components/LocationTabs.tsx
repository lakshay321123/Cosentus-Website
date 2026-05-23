'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LOCATIONS } from '../_data/locations'

/**
 * Tab strip rendered at the top of every location page.
 *
 * Why <Link> with prefetch={true}: Next's App Router prefetches
 * sibling routes on hover, so clicking from /contact/irvine to
 * /contact/napa is effectively instant — same feel as a tab switch
 * but with a real URL change. No router.push needed; the <Link>
 * component handles it client-side already.
 *
 * The active tab is derived from usePathname() rather than a prop so
 * any caller (the chooser page, individual location pages) gets the
 * correct active state for free.
 *
 * Accessibility:
 *   - role="tablist" + role="tab" so screen readers announce this as
 *     a tab group rather than a generic list of links
 *   - aria-current="page" on the active tab
 *   - keyboard nav works because <Link> renders <a>; tab/enter behave
 *     the same as on any anchor
 */
export default function LocationTabs() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Office locations"
      className="location-tabs"
      style={{
        display: 'flex',
        gap: 4,
        borderBottom: '1px solid var(--gray-200)',
        marginBottom: 32,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
      }}
    >
      <style>{`
        .location-tabs::-webkit-scrollbar { display: none; }
        .location-tab {
          padding: 14px 20px;
          font-size: var(--text-sm);
          font-weight: 500;
          letter-spacing: 0.02em;
          color: var(--gray-600);
          text-decoration: none;
          white-space: nowrap;
          border-bottom: 2px solid transparent;
          margin-bottom: -1px;
          transition: color 0.2s ease, border-color 0.2s ease;
        }
        .location-tab:hover {
          color: var(--gray-900);
        }
        .location-tab[aria-current="page"] {
          color: #00B5D6;
          border-bottom-color: #00B5D6;
        }
      `}</style>
      {LOCATIONS.map((loc) => {
        const href = `/contact/${loc.slug}`
        const active = pathname === href
        return (
          <Link
            key={loc.slug}
            href={href}
            prefetch
            role="tab"
            aria-current={active ? 'page' : undefined}
            className="location-tab"
          >
            {loc.shortName}
          </Link>
        )
      })}
    </nav>
  )
}
