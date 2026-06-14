/**
 * Page-context module for the Grace voice agent.
 *
 * Why this exists:
 * Before this module, Grace was told "User is now on: /about" — just the URL.
 * Without a content map, she has to guess from the URL what's on the page,
 * which she does badly. This module gives her two complementary signals:
 *
 *   1. pageMeta(pathname) — a curated one- or two-sentence summary of what's
 *      on each route. Hardcoded so it doesn't drift with random DOM changes.
 *   2. liveSnapshot() — sampled at the moment of the contextual update,
 *      captures the live H1, URL hash (so she knows which anchor was clicked),
 *      and whether a form is rendered. This is short, deterministic, and
 *      always reflects what the user is actually looking at right now.
 *
 * The voice agent combines them into a single `current_page_summary` string
 * passed to ElevenLabs via dynamicVariables at session start and via
 * sendContextualUpdate on every navigation.
 */

/** Static per-route summary. Keep each entry ≤2 sentences for voice context. */
export function pageMeta(pathname: string): string {
  const path = pathname || '/'

  const exact: Record<string, string> = {
    '/':
      'Homepage. Hero reads: "Purpose Built For Your Specialty. Real People + Ai. RCM Redefined." Three clickable hero cards: Zeus Ai (links to /cosentus-ai), 24/7 AI Agents (scrolls to R+A section), >98% Net Collection. Below the hero: 9 voice agent cards (each clickable to start a real voice call), results stats, 6 specialties, RCM calculator, partner logos, testimonials, FAQs.',

    '/about':
      'About Us. Stats row: 25+ Years RCM Expertise, Real People + Ai, 99% Customer Retention, Up to 30% Revenue Growth. Six-stage process (Exploration → Discovery → Commitment → Stabilization → Standardization → Optimization). Nine-person leadership grid, every card clickable to open a full bio popup. Offices list at the bottom.',

    '/cosentus-ai':
      'Zeus AI page. Hero reads: "RCM that thinks." Stats: 23 modules, 15 AI features, 45+ specialties, 18+ EHRs, 4 native protocols (HL7 v2, FHIR R4, X12, REST API), under 5 minutes to first sync. Clickable 5-step process. Multi-EHR diagram with Zeus center surrounded by 6 EHRs (Epic, Oracle, Athena, eCW, NextGen, Meditech). Nine voice agent cards.',

    '/services/rcm':
      'RCM 360 page. Hero reads: "End-to-End Revenue Cycle Management. Every Step. Every Dollar." Walks through the full revenue cycle: eligibility → coding → submission → posting → denials → patient collections. One accountable team. AI handles volume; human specialists handle judgment.',

    '/partnerships':
      'Partnership page. For practices considering structural partnership: capital, M&A, deeper growth. Hero asks: "Is Your Journey to Growth Facing These Challenges?" Four pillars: 25 Years in RCM (19 acquisitions integrated), Upfront Capital Investments, Comprehensive Solutions (offshore teams, tech, support), Transformative Offshoring & Tech. Different audience from regular RCM clients.',

    '/cosentus-cares':
      'Cosentus Cares page. Cosentus\'s commitment to community, employee wellbeing, and practices served. Gallery sub-pages at /cosentus-cares/[slug]. Community inquiries go to wecare@cosentus.com (NOT sales@).',

    '/careers':
      'Careers page. Hero reads: "Join Our Team." Great Place to Work certified three consecutive years. Independently owned, 80% of founding team still here. Applications via hr@cosentus.com.',

    '/case-studies':
      'Client Stories page. Each case study card opens a PDF viewer inline. Stories cover anesthesia, behavioral health, orthopedics, DME, urgent care, ASC, CalAIM, pain management.',

    '/blog':
      'Blog hub. 55 articles on RCM topics: billing, coding, AI, compliance, specialty workflows, payer relationships.',

    '/news':
      'News and press page.',

    '/events':
      'Events page. Upcoming events include AANA 2026 (August), ASCA+SAMBA 2026 (May), Advanced Institute for Anesthesia 2026 (April), COA 2026 (April), ASA ADVANCE 2026 (January), Cosentus Growth Summit 2026, HBMA Fall 2025.',

    '/insights':
      'Insights hub: aggregator of Client Stories, Blog, News, and Events in one place.',

    '/faqs':
      'FAQs page. Categories: Coverage, Differentiation, Integration, Onboarding, Operations, Positioning, Pricing, Results, Risk, Security.',

    '/book':
      'Booking page. Three meeting types: Discovery Call (15 min), Product Demo (30 min), Revenue Analysis Review (45 min).',

    '/specialties':
      'Specialties hub. Six specialty pages: Anesthesia (Accreda), Orthopedics, Pain Management, ASCs, Behavioral Health, Multi-Specialty.',

    '/specialties/anesthesia':
      'Anesthesia specialty page, branded as Accreda by Cosentus. Hero: "Purpose Built for Anesthesia." 23+ years anesthesia-specific RCM, 250+ years combined team experience. Covers anesthesia coding (base units, time units, modifiers AA/QK/QY/AD, concurrency), payer-specific rules, credentialing (DEA, OIG, CAQH), prior auth, 95%+ appeal success. Chris and Cindy voice agents featured.',

    '/specialties/orthopedics':
      'Orthopedics specialty page. Hero: "Orthopedic Billing. Surgeon-Grade Precision." Covers surgical coding, implant pass-through, global-period rules, workers comp, case-type expertise, authorizations, denial prevention. Chris and Cindy voice agents featured.',

    '/specialties/pain-management':
      'Pain Management specialty page. Hero: "Pain Management. Every Procedure. Every Dollar." Interventional coding, documentation defense, payer scrutiny on injection frequency, authorizations, medication oversight. Modifier and laterality errors cost $200–$500 per visit. Cindy voice agent featured.',

    '/specialties/asc':
      'ASC (Ambulatory Surgery Center) specialty page. Hero: "ASC Billing. Built for Speed and Volume." Coordinates two fee streams (facility + professional), case profitability tracking, implant pass-through, contract intelligence on underpayments. Cindy voice agent featured.',

    '/specialties/behavioral-health':
      'Behavioral Health specialty page. Hero: "Behavioral Health. Complex Billing. Clear Results." Time-based CPT coding, medication management, IOP/PHP bundling rules, telehealth compliance, crisis intervention. Hope Services case study ($2M → $16M) featured. Cindy voice agent featured.',

    '/specialties/multi-specialty':
      'Multi-Specialty page. Hero: "Multi-Specialty. One Team. Every Department." Cross-specialty coding consistency, unified credentialing, multi-department coordination. Cindy and Chris voice agents featured.',

    '/privacy': 'Privacy policy page.',
    '/terms': 'Terms of service page.',
  }

  if (exact[path]) return exact[path]

  // Dynamic routes.
  if (path.startsWith('/contact/')) {
    const slug = path.split('/')[2]
    const map: Record<string, string> = {
      irvine: 'Irvine, CA (Headquarters)',
      napa: 'Napa, CA',
      dallas: 'Dallas, TX',
      'salt-lake-city': 'Salt Lake City, UT',
      olathe: 'Olathe, KS',
    }
    const locName = map[slug] || slug
    return `Contact page for ${locName}. Right side has the contact form with fields: Practice Name, Contact Name, Email, Phone, Specialty dropdown (anesthesia/orthopedics/pain_management/asc/behavioral_health/urgent_care/obgyn/other), and Message. Lead auto-attributes to ${slug}. Left side: office address, local phone number, embedded Google Map. Location tabs at the top let users switch offices.`
  }
  if (path.startsWith('/blog/'))           return 'Blog article. Long-form RCM editorial content.'
  if (path.startsWith('/news/'))           return 'News article or press release.'
  if (path.startsWith('/cosentus-cares/')) return 'Cosentus Cares gallery or story page.'
  if (path.startsWith('/form/'))           return 'Generic dynamic form page.'
  if (path.startsWith('/survey/'))         return 'Generic survey page.'

  return `Page at ${path}. No specific description available. Call read_page tool if you need to know what's on it.`
}

/**
 * Sample live DOM state at the moment of the call.
 *
 * SSR-safe: returns empty string when document is undefined.
 *
 * What we sample and why:
 * - H1 text: tells Grace what the page is REALLY showing right now, in case
 *   pageMeta is stale or the page renders dynamic content.
 * - URL hash: when the user clicks an in-page anchor (e.g. /about#leadership),
 *   the hash tells Grace they just jumped to that section. Without this she
 *   only sees the pathname and misses the anchor entirely.
 * - Form-present flag: lets Grace know there's a form she can fill without
 *   having to call read_page.
 */
export function liveSnapshot(): string {
  if (typeof document === 'undefined') return ''
  const parts: string[] = []

  const h1 = document.querySelector('h1')?.textContent?.trim().replace(/\s+/g, ' ')
  if (h1 && h1.length < 200) parts.push(`H1: "${h1}"`)

  const hash = (typeof window !== 'undefined' && window.location.hash) || ''
  if (hash) parts.push(`Anchor: ${hash} (user just jumped to this section)`)

  const hasForm = !!document.querySelector('main form')
  if (hasForm) parts.push('A form is rendered on this page.')

  return parts.join(' | ')
}

/** Combined page context — what we send to ElevenLabs. */
export function pageContext(pathname: string): string {
  const summary = pageMeta(pathname)
  const live = liveSnapshot()
  return live ? `${summary} [Live: ${live}]` : summary
}
