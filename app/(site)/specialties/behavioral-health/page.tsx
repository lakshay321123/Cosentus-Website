import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import SpecialtyFAQ, { type SpecialtyFAQItem } from '@/components/sections/SpecialtyFAQ'
import BehavioralHealthContent from './BehavioralHealthContent'

export const metadata: Metadata = {
  title: 'Behavioral Health Billing & RCM | Psychiatry, Therapy, IOP/PHP & Telehealth | Cosentus',
  description: 'Psychiatry, therapy, IOP/PHP, medication management, and telehealth each carry distinct billing rules. Our team knows every one.',
}

// FAQs per Specialty Pages doc (v1, May 19 2026), section 5
// "Behavioral Health". 5 questions: Q1+Q2 are generic; Q3-Q5
// are behavioral health-specific (CalAIMS/Medi-Cal/county,
// telehealth modifier rule changes, scaling).
const behavioralHealthFaqs: SpecialtyFAQItem[] = [
  {
    question: 'Is Cosentus HIPAA compliant and SOC 2 certified?',
    answer: 'Yes. All patient data is encrypted at rest (AES-256) and in transit (TLS 1.2+). Our platform runs inside AWS with no PHI leaving the boundary. Full audit logging, role-based access control, and BAAs in place. SOC 2 is on our post-launch roadmap. The infrastructure is already built for it.',
  },
  {
    question: 'Will I get a dedicated behavioral health team or a shared billing pool?',
    answer: 'You get a named director, named coders, and named billing leads assigned to your account. They work behavioral health and only behavioral health. They know your payers, your session types, and your authorization requirements.',
  },
  {
    question: 'Can you handle CalAIMS, Medi-Cal, and county behavioral health billing?',
    answer: 'Yes. We have direct experience with CalAIMS billing, county contracts, and Medi-Cal behavioral health requirements. Our team manages the specific documentation, submission, and follow-up processes these programs require.',
  },
  {
    question: 'How do you handle telehealth billing when modifier rules keep changing?',
    answer: 'Our team tracks payer-specific telehealth rules and updates workflows as they change. Place-of-service codes, GT/95 modifiers, audio-only rules. We stay current so your claims go out correctly the first time.',
  },
  {
    question: 'Can you scale with us as we add locations or programs?',
    answer: 'Yes. We\u2019ve helped behavioral health organizations grow from single-location practices to multi-site operations with IOP, PHP, crisis, and telehealth programs. One client grew from $2M to $16M while we managed the entire revenue cycle.',
  },
]

export default function BehavioralHealthPage() {
  return (
    <main>
      <PageHero videoSrc="/videos/specialty-behavioral-health.mp4" specialty
        label="SIMED BY COSENTUS, PURPOSE BUILT FOR BEHAVIORAL HEALTH"
        title={<>Behavioral Health.<br />Complex Billing. Clear Results.</>}
        subtitle="Psychiatry, therapy, IOP/PHP, medication management, and telehealth each carry distinct billing rules. Our team knows every one."
        ctaText="Get Your No-Cost Financial MRI"
        ctaHref="/contact"
      />
      <BehavioralHealthContent />
      <SpecialtyFAQ faqs={behavioralHealthFaqs} />
      <CTASection />
    </main>
  )
}
