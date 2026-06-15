/**
 * Single source of truth for the RCM local-SEO landing pages.
 *
 * Orphan pages, same pattern as /specialties/anesthesia/[city] and
 * /contact/[location]: NO navigation or links anywhere on the site, only
 * reachable via search / direct URL, and listed in /sitemap.xml so
 * crawlers can find them.
 *
 * Used by:
 *   - /services/rcm/[city] (per-city page)
 *   - app/sitemap.ts (derives each city URL)
 *
 * Content is verbatim from the RCM Location Pages doc. Shared blocks (the
 * 9-item services list, the stats, the specialty list, the "Organized by
 * Specialty" card, and the EHR + Financial MRI FAQs) are identical on
 * every page in the doc, so they live here once.
 */

import type { SpecialtySolution } from '@/components/sections/SpecialtyMarquee'

export interface RcmLocation {
  /** URL slug — must match the route segment in /services/rcm/[city] */
  slug: string
  /** Display name used in the H1, "City, CA" (e.g. "Irvine, CA") */
  name: string
  /** Short city-only name (e.g. "Irvine") used in section headers */
  shortName: string
  /** SEO meta title */
  metaTitle: string
  /** SEO meta description (~155 chars) */
  metaDescription: string
  /** Hero subheadline */
  heroSubtitle: string
  /** Local introduction — two paragraphs */
  intro: [string, string]
  /** "We Know California Payers" card body (city-specific) */
  whyKnowPayers: string
  /** Third "Why Local Knowledge" card — title + body (both city-specific) */
  card3: { title: string; body: string }
  /** "About Cosentus" paragraph (city-specific) */
  about: string
  /** First FAQ — "Does Cosentus serve practices in <city>?" */
  faq1: { question: string; answer: string }
  /** Second FAQ — city-specific */
  faq2: { question: string; answer: string }
}

/** "What We Manage" — identical on every city page in the doc. */
export const RCM_WHAT_WE_MANAGE: string[] = [
  'Credentialing and payer enrollment',
  'Eligibility verification and prior authorization',
  'Medical coding by specialty-trained coders',
  'Claim scrubbing and same-day submission to 1,400+ payers',
  'Denial management with root cause review',
  'Appeals with clinical evidence and payer escalation',
  'AR follow-up and collections',
  'Patient billing, payment plans, and support in 50+ languages',
  'Live analytics and reporting by provider, payer, and procedure',
]

/** Stats strip — identical on every city page in the doc. */
export const RCM_STATS: { value: string; label: string }[] = [
  { value: '>98%', label: 'Net Collection Rate' },
  { value: '48hrs', label: 'Charge Lag' },
  { value: '>99%', label: 'Clean Claim Rate' },
  { value: '<15%', label: 'AR Over 90 Days' },
]

/**
 * The 10-step RCM timeline, rendered through the shared SpecialtyMarquee
 * (grid mode) on both the /services/rcm service page and the city pages.
 * Single source of truth so the two stay in sync. Each card maps to one
 * AnimKind in the SpecialtyMarquee anim library; agent badges (Elly /
 * Paige / Priya / Connie / Ariel / Chris / Cindy) render from `agent`.
 */
export const RCM_STEPS: SpecialtySolution[] = [
  {
    eyebrow: 'INSURANCE VERIFICATION',
    title: 'Eligibility Verification',
    description: 'Elly verifies insurance and benefits before every appointment, eliminating eligibility denials at the source.',
    anim: 'eligibility',
    agent: { name: 'Elly', img: 'elly.png' },
  },
  {
    eyebrow: 'AUTHORIZATIONS',
    title: 'Prior Authorization',
    description: 'Paige tracks every open authorization, preventing procedural delays and timely filing lapses.',
    anim: 'stamp',
    agent: { name: 'Paige', img: 'paige.png' },
  },
  {
    eyebrow: 'PRE-SERVICE',
    title: 'Pre-Service Collection',
    description: 'Priya contacts patients 3\u20137 days before service with verified cost estimates. 30\u201340% higher collection rates.',
    anim: 'stat',
    statValue: '40',
    statUnit: '%',
    agent: { name: 'Priya', img: 'priya.png' },
  },
  {
    eyebrow: 'CHARGE CAPTURE',
    title: 'Coding & Capture',
    description: 'AAPC-certified coders ensure accurate CPT and modifier selection. Connie assists with code suggestions and accuracy checks.',
    anim: 'modifiers',
    modifierLabels: ['59', 'XE', 'XS', '51', 'LT', '25'],
    agent: { name: 'Connie', img: 'connie.png' },
  },
  {
    eyebrow: 'CLAIM SCRUBBING',
    title: 'Claim Scrubbing & Submission',
    description: 'Payer-specific edits applied before every submission. Clean claims. Fast payments.',
    anim: 'rules',
  },
  {
    eyebrow: 'PAYMENT POSTING',
    title: 'Payment Posting & Reconciliation',
    description: 'Ariel tracks aging claims and flags payment delays. Underpayments escalate to specialists for resolution.',
    anim: 'badges',
    agent: { name: 'Ariel', img: 'ariel.png' },
  },
  {
    eyebrow: 'AR & DENIALS',
    title: 'AR Follow-Up & Denials',
    description: 'Chris contacts payers proactively. Human denial experts appeal with clinical rationale. 95%+ success.',
    anim: 'pulse',
    agent: { name: 'Chris', img: 'chris.png' },
  },
  {
    eyebrow: 'PATIENT COLLECTIONS',
    title: 'Patient Billing & Collections',
    description: 'Cindy handles balances in 50+ languages with real-time payment processing and payment plan options.',
    anim: 'languages',
    agent: { name: 'Cindy', img: 'cindy.png' },
  },
  {
    eyebrow: 'CREDENTIALING',
    title: 'Credentialing & Contracting',
    description: 'Provider credentialing, re-credentialing, and contract analytics to protect reimbursement rates.',
    anim: 'defense',
  },
  {
    eyebrow: 'REPORTING',
    title: 'Reporting & Analytics',
    description: 'Real-time dashboards by provider, payer, procedure, and denial category. Weekly reviews and QBRs included.',
    anim: 'chart',
  },
]

/**
 * Specialty labels for the "Specialties We Serve in <city>" section.
 * Rendered as "<name> Billing in <shortName>" per the doc.
 */
export const RCM_SPECIALTY_NAMES: string[] = [
  'Anesthesia',
  'Orthopedic',
  'Pain Management',
  'ASC',
  'Behavioral Health',
  'Multi-Specialty',
]

/** "Organized by Specialty" card — identical on every city page. */
export const RCM_ORGANIZED_BY_SPECIALTY = {
  title: 'Organized by Specialty',
  body:
    "We don't run a shared billing pool. Your account is managed by a team that works your specialty full time. Anesthesia, orthopedics, pain management, ASCs, behavioral health, multi-specialty. Each with dedicated coders and directors.",
}

/** EHR FAQ — identical on every city page. */
export const RCM_FAQ_EHR = {
  question: 'Can you work with my existing EHR?',
  answer:
    'Yes. Zeus AI integrates with your existing system. Epic, athenahealth, eClinicalWorks, Plexus, and more. No migration required. No retraining for your staff.',
}

/** Financial MRI FAQ — identical on every city page. */
export const RCM_FAQ_MRI = {
  question: 'What is a Financial MRI?',
  answer:
    'A free diagnostic of your revenue cycle. We analyze your claims, denials, payer mix, and collections to show you exactly where revenue is leaking. No cost. No obligation.',
}

export const RCM_LOCATIONS: RcmLocation[] = [
  {
    slug: 'irvine',
    name: 'Irvine, CA',
    shortName: 'Irvine',
    metaTitle: 'Revenue Cycle Management in Irvine, CA | Cosentus',
    metaDescription:
      'End-to-end revenue cycle management for healthcare practices in Irvine, CA. Specialty-trained teams, AI-native technology, and 25+ years of results. Get your no-cost Financial MRI.',
    heroSubtitle:
      'End-to-end RCM for healthcare practices in Irvine and across Orange County. Specialty-trained teams. AI-native technology.',
    intro: [
      "Irvine sits at the center of one of California's most active healthcare markets. With hospitals, ASCs, multi-specialty groups, and solo practices operating across Orange County, the billing complexity is significant. Multiple payer contracts, high claim volumes, and California-specific reimbursement rules create revenue leakage that most practices don't see until it's too late.",
      'Cosentus is headquartered in Irvine and provides end-to-end revenue cycle management for practices across the region. We manage everything from credentialing and eligibility to coding, claims, denials, patient billing, and collections. Our team is organized by specialty, so the people working your account understand your coding rules, your payers, and your workflow.',
    ],
    whyKnowPayers:
      'California commercial carriers, Medi-Cal, and Medicare all have distinct rules. Our team submits and follows up on claims against California-specific payer behavior every day.',
    card3: {
      title: 'National Reach. Local Focus.',
      body:
        'Cosentus is headquartered right here in Irvine. We manage revenue cycles for practices across the country, and your account gets a named team that knows the Orange County healthcare market inside out.',
    },
    about:
      'Cosentus is a healthcare revenue cycle management company combining specialty-trained experts with AI-native technology. With 25+ years of experience and headquartered in Irvine, we manage the full revenue cycle for healthcare practices across Orange County and the country. From coding to collections, every step is connected through Zeus AI and managed by people who stay in your specialty.',
    faq1: {
      question: 'Does Cosentus serve practices in Irvine?',
      answer:
        'Yes. Cosentus is headquartered in Irvine and manages revenue cycles for practices across Orange County. Your account gets a named director and dedicated team organized by your specialty.',
    },
    faq2: {
      question: 'Which specialties does Cosentus support?',
      answer:
        'We serve anesthesia, orthopedics, pain management, ambulatory surgery centers, behavioral health, and multi-specialty practices. Each specialty has its own team with dedicated coders and billing leads.',
    },
  },
  {
    slug: 'los-angeles',
    name: 'Los Angeles, CA',
    shortName: 'Los Angeles',
    metaTitle: 'Revenue Cycle Management in Los Angeles, CA | Cosentus',
    metaDescription:
      'End-to-end revenue cycle management for healthcare practices in Los Angeles, CA. Specialty-trained teams, AI-native technology, and 25+ years of results. Get your no-cost Financial MRI.',
    heroSubtitle:
      'End-to-end RCM for healthcare practices in Los Angeles and across LA County. Specialty-trained teams. AI-native technology.',
    intro: [
      "Los Angeles is the largest healthcare market in California. Major health systems, hundreds of surgical centers, and thousands of specialty practices compete for patients and revenue across the metro area. The billing complexity is significant. Diverse payer mixes, high Medi-Cal volumes, and California-specific reimbursement rules create revenue leakage that most practices don't catch until month-end.",
      'Cosentus provides end-to-end revenue cycle management for practices in Los Angeles, CA. We manage everything from credentialing and eligibility to coding, claims, denials, patient billing, and collections. Our team is organized by specialty, so the people working your account understand your coding rules, your payers, and your workflow.',
    ],
    whyKnowPayers:
      'California commercial carriers, Medi-Cal, and Medicare all have distinct rules. Our team submits and follows up on claims against California-specific payer behavior every day.',
    card3: {
      title: 'National Reach. Local Focus.',
      body:
        'Cosentus manages revenue cycles for practices across the country. Your account gets a named team that understands the Los Angeles healthcare market and the California payer landscape.',
    },
    about:
      'Cosentus is a healthcare revenue cycle management company combining specialty-trained experts with AI-native technology. With 25+ years of experience, we manage the full revenue cycle for healthcare practices in Los Angeles and across California. From coding to collections, every step is connected through Zeus AI and managed by people who stay in your specialty.',
    faq1: {
      question: 'Does Cosentus serve practices in Los Angeles?',
      answer:
        'Yes. We manage revenue cycles for practices across LA County. Your account gets a named director and dedicated team organized by your specialty.',
    },
    faq2: {
      question: 'Which specialties does Cosentus support in Los Angeles?',
      answer:
        'We serve anesthesia, orthopedics, pain management, ambulatory surgery centers, behavioral health, and multi-specialty practices. Each specialty has its own team with dedicated coders and billing leads.',
    },
  },
  {
    slug: 'san-diego',
    name: 'San Diego, CA',
    shortName: 'San Diego',
    metaTitle: 'Revenue Cycle Management in San Diego, CA | Cosentus',
    metaDescription:
      'End-to-end revenue cycle management for healthcare practices in San Diego, CA. Specialty-trained teams, AI-native technology, and 25+ years of results. Get your no-cost Financial MRI.',
    heroSubtitle:
      'End-to-end RCM for healthcare practices in San Diego and across San Diego County. Specialty-trained teams. AI-native technology.',
    intro: [
      "San Diego is one of California's most active healthcare markets, with major health systems, a growing ASC sector, and a large military-affiliated patient population. Practices in San Diego deal with commercial carriers, Medicare, Medi-Cal, and TRICARE, each with different reimbursement rules and authorization requirements. Leaving any of these unmanaged means leaving money behind.",
      'Cosentus provides end-to-end revenue cycle management for practices in San Diego, CA. We manage everything from credentialing and eligibility to coding, claims, denials, patient billing, and collections. Our team is organized by specialty, so the people working your account understand your specific billing complexity.',
    ],
    whyKnowPayers:
      'California commercial carriers, Medi-Cal, Medicare, and TRICARE all follow different rules. Our team submits and follows up on claims against California-specific payer behavior every day, including the military payer nuances common in San Diego.',
    card3: {
      title: 'National Reach. Local Focus.',
      body:
        'Cosentus manages revenue cycles for practices across the country. Your account gets a named team that understands the San Diego healthcare market and the California payer landscape.',
    },
    about:
      'Cosentus is a healthcare revenue cycle management company combining specialty-trained experts with AI-native technology. With 25+ years of experience, we manage the full revenue cycle for healthcare practices in San Diego and across California. From coding to collections, every step is connected through Zeus AI and managed by people who stay in your specialty.',
    faq1: {
      question: 'Does Cosentus serve practices in San Diego?',
      answer:
        'Yes. We manage revenue cycles for practices across San Diego County. Your account gets a named director and dedicated team organized by your specialty.',
    },
    faq2: {
      question: 'Do you handle TRICARE billing?',
      answer:
        'Yes. San Diego has a large military-affiliated patient population, and TRICARE is a significant payer in the region. Our team understands TRICARE authorization requirements, reimbursement rules, and claim submission processes.',
    },
  },
  {
    slug: 'orange-county',
    name: 'Orange County, CA',
    shortName: 'Orange County',
    metaTitle: 'Revenue Cycle Management in Orange County, CA | Cosentus',
    metaDescription:
      'End-to-end revenue cycle management for healthcare practices in Orange County, CA. Specialty-trained teams, AI-native technology. Headquartered in Irvine. Get your no-cost Financial MRI.',
    heroSubtitle:
      'End-to-end RCM for healthcare practices across Orange County. Specialty-trained teams. AI-native technology. Headquartered right here.',
    intro: [
      'Orange County is home to a dense network of hospitals, ambulatory surgery centers, and specialty practices spanning Irvine, Anaheim, Santa Ana, Huntington Beach, and beyond. Major health systems like Providence St. Joseph, MemorialCare, Hoag, and Kaiser Permanente operate across the region, creating a competitive market where billing accuracy and collections speed directly affect growth.',
      'Cosentus is headquartered in Irvine and provides end-to-end revenue cycle management for practices across Orange County. We manage everything from credentialing and eligibility to coding, claims, denials, patient billing, and collections. Our team is organized by specialty, so the people working your account understand your coding rules, your payers, and your workflow.',
    ],
    whyKnowPayers:
      'California commercial carriers, Medi-Cal, and Medicare all have distinct rules. Our team submits and follows up on claims against California-specific payer behavior every day.',
    card3: {
      title: 'Headquartered in Orange County.',
      body:
        'Cosentus is based in Irvine. This is our home market. We manage revenue cycles for practices across the country, and your account gets a named team that knows the Orange County healthcare landscape inside out.',
    },
    about:
      'Cosentus is a healthcare revenue cycle management company combining specialty-trained experts with AI-native technology. Headquartered in Irvine with 25+ years of experience, we manage the full revenue cycle for healthcare practices across Orange County and the country. From coding to collections, every step is connected through Zeus AI and managed by people who stay in your specialty.',
    faq1: {
      question: 'Is Cosentus based in Orange County?',
      answer:
        'Yes. Cosentus is headquartered in Irvine, CA. We serve practices across Orange County and nationwide. Your account gets a named director and dedicated team organized by your specialty.',
    },
    faq2: {
      question: 'Which specialties does Cosentus support?',
      answer:
        'We serve anesthesia, orthopedics, pain management, ambulatory surgery centers, behavioral health, and multi-specialty practices. Each specialty has its own team with dedicated coders and billing leads.',
    },
  },
  {
    slug: 'sacramento',
    name: 'Sacramento, CA',
    shortName: 'Sacramento',
    metaTitle: 'Revenue Cycle Management in Sacramento, CA | Cosentus',
    metaDescription:
      'End-to-end revenue cycle management for healthcare practices in Sacramento, CA. Specialty-trained teams, AI-native technology, and 25+ years of results. Get your no-cost Financial MRI.',
    heroSubtitle:
      'End-to-end RCM for healthcare practices in Sacramento and across the Greater Sacramento region. Specialty-trained teams. AI-native technology.',
    intro: [
      'Sacramento is a growing healthcare market serving urban and rural populations across the Greater Sacramento region. UC Davis Health, Sutter Health, Dignity Health, and Kaiser Permanente anchor the market, with independent practices and surgery centers filling the gaps. High Medi-Cal volumes and a mix of commercial carriers create a payer environment that demands billing precision.',
      'Cosentus provides end-to-end revenue cycle management for practices in Sacramento, CA. We manage everything from credentialing and eligibility to coding, claims, denials, patient billing, and collections. Our team is organized by specialty, so the people working your account understand your coding rules, your payers, and the Sacramento market.',
    ],
    whyKnowPayers:
      'California commercial carriers, Medi-Cal, and Medicare all have distinct rules. High Medi-Cal volumes in the Sacramento region make it especially important to have a team that understands state-specific reimbursement.',
    card3: {
      title: 'National Reach. Local Focus.',
      body:
        'Cosentus manages revenue cycles for practices across the country. Your account gets a named team that understands the Sacramento healthcare market and the Central California payer landscape.',
    },
    about:
      'Cosentus is a healthcare revenue cycle management company combining specialty-trained experts with AI-native technology. With 25+ years of experience, we manage the full revenue cycle for healthcare practices in Sacramento and across California. From coding to collections, every step is connected through Zeus AI and managed by people who stay in your specialty.',
    faq1: {
      question: 'Does Cosentus serve practices in Sacramento?',
      answer:
        'Yes. We manage revenue cycles for practices in Sacramento and across the Greater Sacramento region. Your account gets a named director and dedicated team organized by your specialty.',
    },
    faq2: {
      question: 'How do you handle the high Medi-Cal volume in the Sacramento area?',
      answer:
        'Our team understands Medi-Cal reimbursement rules, authorization requirements, and claim submission processes. We manage Medi-Cal alongside commercial and Medicare claims for practices across the region.',
    },
  },
  {
    slug: 'san-francisco',
    name: 'San Francisco, CA',
    shortName: 'San Francisco',
    metaTitle: 'Revenue Cycle Management in San Francisco, CA | Cosentus',
    metaDescription:
      'End-to-end revenue cycle management for healthcare practices in San Francisco, CA. Specialty-trained teams, AI-native technology, and 25+ years of results. Get your no-cost Financial MRI.',
    heroSubtitle:
      'End-to-end RCM for healthcare practices in San Francisco and across the Bay Area. Specialty-trained teams. AI-native technology.',
    intro: [
      'San Francisco is one of the most competitive healthcare markets in the country. UCSF Health, Dignity Health, Kaiser Permanente, and Sutter Health operate major facilities across the city, alongside specialty practices and surgical centers. High operating costs mean every dollar of reimbursement matters. Leaving revenue on the table is not an option for practices in this market.',
      'Cosentus provides end-to-end revenue cycle management for practices in San Francisco, CA. We manage everything from credentialing and eligibility to coding, claims, denials, patient billing, and collections. Our team is organized by specialty, with dedicated directors, coders, and billing leads managing your entire revenue cycle.',
    ],
    whyKnowPayers:
      "California commercial carriers, Medi-Cal, and Medicare all have distinct rules. San Francisco's premium commercial contracts require precise billing to capture every dollar of agreed reimbursement.",
    card3: {
      title: 'National Reach. Local Focus.',
      body:
        'Cosentus manages revenue cycles for practices across the country. Your account gets a named team that understands the San Francisco healthcare market and the Bay Area payer landscape.',
    },
    about:
      'Cosentus is a healthcare revenue cycle management company combining specialty-trained experts with AI-native technology. With 25+ years of experience, we manage the full revenue cycle for healthcare practices in San Francisco and across the Bay Area. From coding to collections, every step is connected through Zeus AI and managed by people who stay in your specialty.',
    faq1: {
      question: 'Does Cosentus serve practices in San Francisco?',
      answer:
        'Yes. We manage revenue cycles for practices across San Francisco and the Bay Area. Your account gets a named director and dedicated team organized by your specialty.',
    },
    faq2: {
      question: 'Which specialties does Cosentus support?',
      answer:
        'We serve anesthesia, orthopedics, pain management, ambulatory surgery centers, behavioral health, and multi-specialty practices. Each specialty has its own team with dedicated coders and billing leads.',
    },
  },
  {
    slug: 'san-jose',
    name: 'San Jose, CA',
    shortName: 'San Jose',
    metaTitle: 'Revenue Cycle Management in San Jose, CA | Cosentus',
    metaDescription:
      'End-to-end revenue cycle management for healthcare practices in San Jose, CA. Specialty-trained teams, AI-native technology, and 25+ years of results. Get your no-cost Financial MRI.',
    heroSubtitle:
      'End-to-end RCM for healthcare practices in San Jose and across Silicon Valley. Specialty-trained teams. AI-native technology.',
    intro: [
      'San Jose and the broader Silicon Valley region are served by Stanford Health Care, El Camino Health, Good Samaritan Hospital, and a growing network of specialty practices. High operating costs and complex payer mixes mean practices in the region need billing teams that capture every dollar of reimbursement. There is no margin for error.',
      'Cosentus provides end-to-end revenue cycle management for practices in San Jose, CA. We manage everything from credentialing and eligibility to coding, claims, denials, patient billing, and collections. Our specialty-organized teams manage your entire revenue cycle from coding to collections.',
    ],
    whyKnowPayers:
      'California commercial carriers, Medi-Cal, and Medicare all have distinct rules. Our team submits and follows up on claims against California-specific payer behavior every day.',
    card3: {
      title: 'National Reach. Local Focus.',
      body:
        'Cosentus manages revenue cycles for practices across the country. Your account gets a named team that understands the Silicon Valley healthcare market and the California payer landscape.',
    },
    about:
      'Cosentus is a healthcare revenue cycle management company combining specialty-trained experts with AI-native technology. With 25+ years of experience, we manage the full revenue cycle for healthcare practices in San Jose and across Silicon Valley. From coding to collections, every step is connected through Zeus AI and managed by people who stay in your specialty.',
    faq1: {
      question: 'Does Cosentus serve practices in San Jose?',
      answer:
        'Yes. We manage revenue cycles for practices across San Jose and the Silicon Valley region. Your account gets a named director and dedicated team organized by your specialty.',
    },
    faq2: {
      question: 'Which specialties does Cosentus support?',
      answer:
        'We serve anesthesia, orthopedics, pain management, ambulatory surgery centers, behavioral health, and multi-specialty practices. Each specialty has its own team with dedicated coders and billing leads.',
    },
  },
  {
    slug: 'long-beach',
    name: 'Long Beach, CA',
    shortName: 'Long Beach',
    metaTitle: 'Revenue Cycle Management in Long Beach, CA | Cosentus',
    metaDescription:
      'End-to-end revenue cycle management for healthcare practices in Long Beach, CA. Specialty-trained teams, AI-native technology, and 25+ years of results. Get your no-cost Financial MRI.',
    heroSubtitle:
      'End-to-end RCM for healthcare practices in Long Beach and across the greater LA South Bay area. Specialty-trained teams. AI-native technology.',
    intro: [
      'Long Beach sits between Los Angeles and Orange County, serving a diverse patient population with significant workers compensation, Medi-Cal, and VA volumes alongside commercial payers. MemorialCare and the VA Long Beach Healthcare System anchor the market. Practices in the city need billing teams that can manage this payer complexity without leaving money behind.',
      'Cosentus provides end-to-end revenue cycle management for practices in Long Beach, CA. We manage everything from credentialing and eligibility to coding, claims, denials, patient billing, and collections. Our team is organized by specialty, with dedicated directors, coders, and billing leads for your account.',
    ],
    whyKnowPayers:
      "California commercial carriers, Medi-Cal, Medicare, workers comp, and VA all follow different rules. Long Beach practices deal with all of them. Our team manages claims against each payer's specific requirements every day.",
    card3: {
      title: 'National Reach. Local Focus.',
      body:
        'Cosentus manages revenue cycles for practices across the country. Your account gets a named team that understands the Long Beach and South Bay healthcare market.',
    },
    about:
      'Cosentus is a healthcare revenue cycle management company combining specialty-trained experts with AI-native technology. With 25+ years of experience, we manage the full revenue cycle for healthcare practices in Long Beach and across Southern California. From coding to collections, every step is connected through Zeus AI and managed by people who stay in your specialty.',
    faq1: {
      question: 'Does Cosentus serve practices in Long Beach?',
      answer:
        'Yes. We manage revenue cycles for practices in Long Beach and across the South Bay area. Your account gets a named director and dedicated team organized by your specialty.',
    },
    faq2: {
      question: 'Do you handle workers compensation and VA billing?',
      answer:
        'Yes. Long Beach has significant workers comp and VA patient volumes. Our team understands the billing rules, authorization requirements, and follow-up processes for both payer types.',
    },
  },
  {
    slug: 'bakersfield',
    name: 'Bakersfield, CA',
    shortName: 'Bakersfield',
    metaTitle: 'Revenue Cycle Management in Bakersfield, CA | Cosentus',
    metaDescription:
      'End-to-end revenue cycle management for healthcare practices in Bakersfield, CA. Specialty-trained teams, AI-native technology, and 25+ years of results. Get your no-cost Financial MRI.',
    heroSubtitle:
      'End-to-end RCM for healthcare practices in Bakersfield and across Kern County. Specialty-trained teams. AI-native technology.',
    intro: [
      "Bakersfield is a critical healthcare hub for California's Central Valley, serving a patient population with high Medi-Cal utilization and significant agricultural workers compensation volumes. Mercy Hospital, Adventist Health Bakersfield, and Kern Medical anchor the market. Practices in the region often serve as the primary access point for specialty care, making billing accuracy and collections speed essential to sustainability.",
      'Cosentus provides end-to-end revenue cycle management for practices in Bakersfield, CA. We manage everything from credentialing and eligibility to coding, claims, denials, patient billing, and collections. Our specialty-organized teams manage your entire revenue cycle with named directors and dedicated billing leads.',
    ],
    whyKnowPayers:
      'Bakersfield practices navigate high Medi-Cal volumes alongside commercial carriers, Medicare, and agricultural workers compensation. Our team understands the reimbursement rules for each payer type in the Central Valley.',
    card3: {
      title: 'National Reach. Local Focus.',
      body:
        'Cosentus manages revenue cycles for practices across the country. Your account gets a named team that understands the Bakersfield and Central Valley healthcare market.',
    },
    about:
      'Cosentus is a healthcare revenue cycle management company combining specialty-trained experts with AI-native technology. With 25+ years of experience, we manage the full revenue cycle for healthcare practices in Bakersfield and across the Central Valley. From coding to collections, every step is connected through Zeus AI and managed by people who stay in your specialty.',
    faq1: {
      question: 'Does Cosentus serve practices in Bakersfield?',
      answer:
        'Yes. We manage revenue cycles for practices in Bakersfield and across Kern County. Your account gets a named director and dedicated team organized by your specialty.',
    },
    faq2: {
      question: 'How do you handle agricultural workers compensation billing?',
      answer:
        'Workers compensation is a significant payer type in the Central Valley. Our team understands workers comp billing rules, authorization requirements, and follow-up processes specific to California.',
    },
  },
  {
    slug: 'oakland',
    name: 'Oakland, CA',
    shortName: 'Oakland',
    metaTitle: 'Revenue Cycle Management in Oakland, CA | Cosentus',
    metaDescription:
      'End-to-end revenue cycle management for healthcare practices in Oakland, CA. Specialty-trained teams, AI-native technology, and 25+ years of results. Get your no-cost Financial MRI.',
    heroSubtitle:
      'End-to-end RCM for healthcare practices in Oakland and across the East Bay. Specialty-trained teams. AI-native technology.',
    intro: [
      "Oakland and the East Bay serve one of the most diverse patient populations in California. Kaiser Permanente Oakland, Alta Bates Summit Medical Center, and UCSF Benioff Children's Hospital Oakland anchor the market alongside community health centers and specialty practices. Complex payer mixes that include high Medi-Cal volumes, commercial carriers, and Medicare make billing precision essential.",
      'Cosentus provides end-to-end revenue cycle management for practices in Oakland, CA. We manage everything from credentialing and eligibility to coding, claims, denials, patient billing, and collections. Our specialty-organized teams manage your entire revenue cycle with named directors and dedicated billing leads.',
    ],
    whyKnowPayers:
      "California commercial carriers, Medi-Cal, and Medicare all have distinct rules. Oakland's diverse payer mix makes it especially important to have a team that manages each payer's requirements accurately.",
    card3: {
      title: 'National Reach. Local Focus.',
      body:
        'Cosentus manages revenue cycles for practices across the country. Your account gets a named team that understands the Oakland and East Bay healthcare market.',
    },
    about:
      'Cosentus is a healthcare revenue cycle management company combining specialty-trained experts with AI-native technology. With 25+ years of experience, we manage the full revenue cycle for healthcare practices in Oakland and across the East Bay. From coding to collections, every step is connected through Zeus AI and managed by people who stay in your specialty.',
    faq1: {
      question: 'Does Cosentus serve practices in Oakland?',
      answer:
        'Yes. We manage revenue cycles for practices across Oakland and the East Bay. Your account gets a named director and dedicated team organized by your specialty.',
    },
    faq2: {
      question: 'Which specialties does Cosentus support?',
      answer:
        'We serve anesthesia, orthopedics, pain management, ambulatory surgery centers, behavioral health, and multi-specialty practices. Each specialty has its own team with dedicated coders and billing leads.',
    },
  },
  {
    slug: 'fresno',
    name: 'Fresno, CA',
    shortName: 'Fresno',
    metaTitle: 'Revenue Cycle Management in Fresno, CA | Cosentus',
    metaDescription:
      'End-to-end revenue cycle management for healthcare practices in Fresno, CA. Specialty-trained teams, AI-native technology, and 25+ years of results. Get your no-cost Financial MRI.',
    heroSubtitle:
      'End-to-end RCM for healthcare practices in Fresno and across the Central Valley. Specialty-trained teams. AI-native technology.',
    intro: [
      "Fresno is the largest city in California's Central Valley and a regional healthcare hub. Community Medical Centers, Saint Agnes Medical Center, and Kaiser Permanente serve a large patient population with high Medi-Cal utilization. Agricultural workers compensation is common, and practices in Fresno serve as access points for patients from across the Valley.",
      'Cosentus provides end-to-end revenue cycle management for practices in Fresno, CA. We manage everything from credentialing and eligibility to coding, claims, denials, patient billing, and collections. Our specialty-organized teams manage your entire revenue cycle with named directors and dedicated billing leads.',
    ],
    whyKnowPayers:
      'Fresno practices navigate high Medi-Cal volumes alongside commercial carriers, Medicare, and agricultural workers compensation. Our team understands the reimbursement rules for each payer type in the Central Valley.',
    card3: {
      title: 'National Reach. Local Focus.',
      body:
        'Cosentus manages revenue cycles for practices across the country. Your account gets a named team that understands the Fresno and Central Valley healthcare market.',
    },
    about:
      'Cosentus is a healthcare revenue cycle management company combining specialty-trained experts with AI-native technology. With 25+ years of experience, we manage the full revenue cycle for healthcare practices in Fresno and across the Central Valley. From coding to collections, every step is connected through Zeus AI and managed by people who stay in your specialty.',
    faq1: {
      question: 'Does Cosentus serve practices in Fresno?',
      answer:
        'Yes. We manage revenue cycles for practices in Fresno and across the Central Valley. Your account gets a named director and dedicated team organized by your specialty.',
    },
    faq2: {
      question: 'How do you handle agricultural workers compensation billing?',
      answer:
        'Workers compensation is a significant payer type in the Central Valley. Our team understands workers comp billing rules, authorization requirements, and follow-up processes specific to California.',
    },
  },
]

export function getRcmLocationBySlug(slug: string): RcmLocation | undefined {
  return RCM_LOCATIONS.find((l) => l.slug === slug)
}
