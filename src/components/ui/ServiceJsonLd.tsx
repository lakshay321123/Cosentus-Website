import { SITE_URL } from '@/lib/site-url'

/**
 * ServiceJsonLd — Schema.org Service markup for the service and specialty
 * pages. `provider` links to the Organization entity defined on the homepage
 * (#organization), so Google ties each service to the Cosentus company.
 *
 * Service name + description are centralized here, keyed by path. The
 * descriptions are copied verbatim from each page's own metadata so the
 * structured data matches the on-page copy (no separate, drifting source).
 */
const SERVICES: Record<string, { name: string; description: string }> = {
  '/services/billing-coding': {
    name: 'Medical Billing & Coding',
    description:
      'Medical billing and coding for physician practices, specialty groups, and surgery centers across 20+ specialties. Powered by Real + Artificial Intelligence.',
  },
  '/services/practice-management': {
    name: 'Complete Practice Management',
    description:
      'Beyond billing, front desk operations, credentialing, scheduling, financial counseling, and operational support so your clinical team focuses on patients.',
  },
  '/services/ehr-technology': {
    name: 'EHR & Technology Integration',
    description:
      'Works with your existing EHR, Epic, Athenahealth, eClinicalWorks, and more. Or add Medcloud, our purpose-built PM solution. Seamlessly integrated with Real + Artificial Intelligence.',
  },
  '/services/rcm': {
    name: 'Revenue Cycle Management',
    description:
      'We manage your entire revenue cycle, patient registration to final payment, with specialty-trained teams and Real + Artificial Intelligence.',
  },
  '/specialties/anesthesia': {
    name: 'Anesthesia Billing & RCM',
    description:
      'Accreda by Cosentus. 23+ years of anesthesia-specific RCM, backed by Real + Artificial Intelligence.',
  },
  '/specialties/orthopedics': {
    name: 'Orthopedic Billing & RCM',
    description:
      'Joint replacements, arthroscopy, spinal surgery, and implant cases demand accuracy at every billing step. Cosentus delivers it.',
  },
  '/specialties/pain-management': {
    name: 'Pain Management Billing & RCM',
    description:
      'Injections, SCS, ablations, and medication management. Coded right, authorized ahead of time, and defended when payers push back.',
  },
  '/specialties/asc': {
    name: 'ASC Billing & RCM',
    description:
      'Coordinated facility and professional billing. Implant accuracy. Case costing. Contract management. All under one roof.',
  },
  '/specialties/behavioral-health': {
    name: 'Behavioral Health Billing & RCM',
    description:
      'Psychiatry, therapy, IOP/PHP, medication management, and telehealth each carry distinct billing rules. Our team knows every one.',
  },
  '/specialties/multi-specialty': {
    name: 'Multi-Specialty Billing & RCM',
    description:
      'Multi-specialty practices face different codes, different payers, and different rules across every department. One RCM partner that manages it all without dropping the ball.',
  },
}

export default function ServiceJsonLd({ path }: { path: string }) {
  const svc = SERVICES[path]
  if (!svc) return null

  const json = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: svc.name,
    description: svc.description,
    serviceType: svc.name,
    provider: { '@id': `${SITE_URL}/#organization` },
    areaServed: { '@type': 'Country', name: 'United States' },
    url: `${SITE_URL}${path}`,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  )
}
