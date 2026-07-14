/**
 * Single source of truth for the 5 Cosentus office locations.
 *
 * Used by:
 *   - /contact (the chooser page) — to render 5 location cards
 *   - /contact/[location] (per-location page) — for hero image,
 *     address, phone, embedded map, and JSON-LD LocalBusiness schema
 *   - app/sitemap.ts — to include the 5 location URLs in the XML sitemap
 *   - The shared LocationTabs component — to render the tab switcher
 *
 * SEO notes:
 *   - Each location has a unique title, description, and copy paragraph.
 *     Google will index 5 separate URLs, each ranking for its own city.
 *   - lat/lng are used for the embedded Google Map iframe and for the
 *     LocalBusiness schema's geo property.
 *   - phone is the location's local line where available, falling back
 *     to the shared (877) line. Local numbers help local SEO.
 */

export interface Location {
  /** URL slug — must match the route segment in /contact/[location] */
  slug: string
  /** Display name (city, state) */
  name: string
  /** Short city-only name for compact UI like the tab switcher */
  shortName: string
  /** "Headquarters" or "Regional Office" */
  label: 'Headquarters' | 'Regional Office'
  /** Full street address for the schema and the address card */
  address: {
    street: string
    city: string
    region: string // state abbreviation, e.g. 'CA'
    postalCode: string
    country: string // ISO country code, e.g. 'US'
  }
  /** Local phone in display format e.g. "(949) 216-4280" */
  phone: string
  /** Hero photo path under /public */
  image: string
  /** Latitude for the embedded Google Map */
  lat: number
  /** Longitude for the embedded Google Map */
  lng: number
  /** Unique copy paragraph (2-3 sentences) — shows above the form */
  copy: string
  /** SEO meta title */
  metaTitle: string
  /** SEO meta description (~155 chars) */
  metaDescription: string
}

export const LOCATIONS: Location[] = [
  {
    slug: 'irvine',
    name: 'Irvine, CA',
    shortName: 'Irvine',
    label: 'Headquarters',
    address: {
      street: '300 Spectrum Center Dr, Suite 1450',
      city: 'Irvine',
      region: 'CA',
      postalCode: '92618',
      country: 'US',
    },
    phone: '(949) 216-4280',
    image: '/images/locations/irvine.png',
    lat: 33.6519,
    lng: -117.7426,
    copy:
      "Our Irvine headquarters anchors Cosentus's nationwide RCM operation. From Orange County we coordinate executive leadership, Ai engineering, and client success teams serving physician practices, specialty groups, and surgery centers across the United States.",
    metaTitle: 'Cosentus Headquarters — Irvine, CA | Healthcare RCM & Ai',
    metaDescription:
      "Cosentus's Orange County headquarters: 300 Spectrum Center Dr, Irvine, CA. Specialty-trained billing teams and Real + Ai for healthcare practices nationwide.",
  },
  {
    slug: 'napa',
    name: 'Napa, CA',
    shortName: 'Napa',
    label: 'Regional Office',
    address: {
      street: '550 Gateway Dr #100',
      city: 'Napa',
      region: 'CA',
      postalCode: '94558',
      country: 'US',
    },
    phone: '+1 (877) 266 9040',
    image: '/images/locations/napa.jpg',
    lat: 38.2944,
    lng: -122.2854,
    copy:
      'Our Napa office serves healthcare practices across Northern California, the San Francisco Bay Area, and the Sacramento Valley. The team specializes in anesthesia, ambulatory surgery centers, and multi-specialty groups operating in the region.',
    metaTitle: 'Healthcare RCM in Napa, CA | Cosentus Northern California',
    metaDescription:
      'Cosentus Napa office: 550 Gateway Dr #100, Napa, CA. Specialty billing and Ai-powered RCM for Northern California healthcare practices, ASCs, and surgical groups.',
  },
  {
    slug: 'dallas',
    name: 'Dallas, TX',
    shortName: 'Dallas',
    label: 'Regional Office',
    address: {
      street: '14850 Quorum Dr, Suite 400',
      city: 'Dallas',
      region: 'TX',
      postalCode: '75254',
      country: 'US',
    },
    phone: '(888) 521-0055',
    image: '/images/locations/dallas.png',
    lat: 32.9573,
    lng: -96.8204,
    copy:
      'Our Dallas office supports healthcare practices throughout Texas and the broader South Central region. The team brings deep expertise in orthopedics, pain management, and surgical specialties, with strong experience navigating Texas Medicaid and major regional payers.',
    metaTitle: 'Healthcare RCM in Dallas, TX | Cosentus Texas Office',
    metaDescription:
      'Cosentus Dallas office: 14850 Quorum Dr, Suite 400, Dallas, TX. Specialty-trained billing and Real + Ai for Texas healthcare practices, surgery centers, and pain clinics.',
  },
  {
    slug: 'salt-lake-city',
    name: 'Salt Lake City, UT',
    shortName: 'Salt Lake City',
    label: 'Regional Office',
    address: {
      street: '280 South Main Street',
      city: 'Bountiful',
      region: 'UT',
      postalCode: '84010',
      country: 'US',
    },
    phone: '+1 (877) 266 9040',
    image: '/images/locations/salt-lake-city.jpg',
    lat: 40.8894,
    lng: -111.8808,
    copy:
      "Our Salt Lake City office serves practices across Utah and the broader Mountain West. From Salt Lake we support the region's surgery centers, anesthesia groups, and behavioral health providers with specialty-trained coders, dedicated denial-management teams, and full revenue cycle services.",
    metaTitle: 'Healthcare RCM in Salt Lake City, UT | Cosentus Mountain West',
    metaDescription:
      "Cosentus Salt Lake City office serving Utah and the Mountain West. Specialty billing, denial management, and Ai-powered RCM for healthcare practices across the region.",
  },
  {
    slug: 'olathe',
    name: 'Olathe, KS',
    shortName: 'Olathe',
    label: 'Regional Office',
    address: {
      street: '100 E Park St #2',
      city: 'Olathe',
      region: 'KS',
      postalCode: '66061',
      country: 'US',
    },
    phone: '(913) 262-2323',
    image: '/images/locations/olathe.jpg',
    lat: 38.8814,
    lng: -94.8191,
    copy:
      'Our Olathe office serves the Kansas City metro and the broader Midwest. The team supports independent practices, surgery centers, and specialty groups across Kansas, Missouri, and surrounding states with specialty-focused billing and root-cause denial management.',
    metaTitle: 'Healthcare RCM in Olathe, KS | Cosentus Kansas City Metro',
    metaDescription:
      'Cosentus Olathe office: 100 E Park St #2, Olathe, KS. Specialty-trained billing and Real + Ai for Kansas City and Midwest healthcare practices and surgery centers.',
  },
]

/** O(1) lookup helper — returns null if slug not found. */
export function getLocationBySlug(slug: string): Location | null {
  return LOCATIONS.find((l) => l.slug === slug) ?? null
}
