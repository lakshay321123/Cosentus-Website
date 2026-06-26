import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import SpecialtyFAQ from '@/components/sections/SpecialtyFAQ'
import AnesthesiaContent from './AnesthesiaContent'
import ServiceJsonLd from '@/components/ui/ServiceJsonLd'

export const metadata: Metadata = {
  alternates: { canonical: '/specialties/anesthesia' },
  title: 'Purpose Built for Anesthesia | Accreda by Cosentus',
  description: 'Accreda by Cosentus. 23+ years of anesthesia-specific RCM, backed by Real + Artificial Intelligence.',
}

// FAQ content for the Anesthesia specialty page, sourced verbatim
// from the Cosentus Specialty Pages Content doc (v1, May 19 2026).
// First two questions are the standardized cross-specialty pair
// (HIPAA/SOC 2 + dedicated team), the remaining three are
// anesthesia-specific.
const anesthesiaFaqs = [
  {
    question: 'Is Cosentus HIPAA compliant and SOC 2 certified?',
    answer:
      'Yes. All patient data is encrypted at rest (AES-256) and in transit (TLS 1.2+). Our platform runs inside AWS with no PHI leaving the boundary. Full audit logging, role-based access control, and BAAs in place. SOC 2 is on our post-launch roadmap. The infrastructure is already built for it.',
  },
  {
    question: 'Will I get a dedicated anesthesia team or a shared billing pool?',
    answer:
      'You get a named director, named coders, and named billing leads assigned to your account. They work anesthesia and only anesthesia. From 8am to 5pm. No rotating staff, no shared pool, no help desk lottery.',
  },
  {
    question: 'How do you handle concurrency and medical direction rules?',
    answer:
      'Our coders are trained on TEFRA, medical direction (QK, QY), medical supervision (AD), and personally performed (AA) modifiers. We track concurrency logs and match them against what each payer requires to make sure every case is billed at the highest allowable level.',
  },
  {
    question: 'Can you work with our existing anesthesia practice management system?',
    answer:
      'Yes. Zeus sits on top of your existing EHR or PM system. Whether that\u2019s Plexus, AIMS, Epic, or anything else. No migration required. No retraining for your staff. Data syncs both ways.',
  },
  {
    question: 'What happens when a payer denies an anesthesia claim?',
    answer:
      'Every denial gets a root cause review. Not just an appeal letter. We identify whether it was a coding issue, a modifier error, a missing auth, or a payer quirk, and we fix the process so it doesn\u2019t recur. Our appeal success rate is above 95%.',
  },
]

export default function AnesthesiaPage() {
  return (
    <main>
      <ServiceJsonLd path="/specialties/anesthesia" />
      <PageHero videoSrc="/videos/specialty-anesthesia.mp4" specialty
        label="ACCREDA BY COSENTUS, PURPOSE BUILT FOR ANESTHESIA"
        title="Purpose Built for Anesthesia."
        subtitle="Accreda by Cosentus. 23+ years of anesthesia-specific RCM, backed by Real + Artificial Intelligence."
        ctaText="Get Your No-Cost Financial MRI"
        ctaHref="/contact"
      />
      <AnesthesiaContent />
      <SpecialtyFAQ faqs={anesthesiaFaqs} />
      <CTASection />
    </main>
  )
}
