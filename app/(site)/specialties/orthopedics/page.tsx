import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import SpecialtyFAQ, { type SpecialtyFAQItem } from '@/components/sections/SpecialtyFAQ'
import OrthopedicsContent from './OrthopedicsContent'
import ServiceJsonLd from '@/components/ui/ServiceJsonLd'

export const metadata: Metadata = {
  title: 'Orthopedic Billing & RCM | Surgeon-Grade Precision | Cosentus',
  description: 'Joint replacements, arthroscopy, spinal surgery, and implant cases demand accuracy at every billing step. Cosentus delivers it.',
}

// FAQs per Specialty Pages doc (v1, May 19 2026), section 2
// "Orthopedics". 5 questions: Q1+Q2 are the generic cross-page
// questions (HIPAA/SOC2, dedicated team); Q3-Q5 are specialty-
// specific (modifier accuracy, implant pass-through, WC/PI).
const orthopedicsFaqs: SpecialtyFAQItem[] = [
  {
    question: 'Is Cosentus HIPAA compliant and SOC 2 certified?',
    answer: 'Yes. All patient data is encrypted at rest (AES-256) and in transit (TLS 1.2+). Our platform runs inside AWS with no PHI leaving the boundary. Full audit logging, role-based access control, and BAAs in place. SOC 2 is on our post-launch roadmap. The infrastructure is already built for it.',
  },
  {
    question: 'Will I get a dedicated orthopedic team or a shared billing pool?',
    answer: 'You get a named director, named coders, and named billing leads assigned to your account. They work orthopedics and only orthopedics. From 8am to 5pm. No rotating staff, no shared pool.',
  },
  {
    question: 'How do you handle modifier accuracy on multi-procedure surgical cases?',
    answer: 'Our coders are trained specifically on orthopedic modifier usage (59, XE, XS, XP, 51, 50) and understand when bundling applies and when it doesn\u2019t. We run modifier rules that vary by payer before submission so errors are caught before the claim goes out.',
  },
  {
    question: 'Do you handle implant pass-through billing?',
    answer: 'Yes. We track implant costs, match them against facility records, and make sure pass-through billing is documented correctly for every case. Underpayments on implants are flagged and recovered.',
  },
  {
    question: 'Can you manage workers\u2019 comp and personal injury billing?',
    answer: 'Absolutely. WC and PI follow different rules than commercial or Medicare. Our team manages them as a separate workflow with the right documentation, timelines, and follow-up protocols.',
  },
]

export default function OrthopedicsPage() {
  return (
    <main>
      <ServiceJsonLd path="/specialties/orthopedics" />
      <PageHero videoSrc="/videos/specialty-orthopedics.mp4" specialty
        label="ORTHOPEDICS BY COSENTUS, PURPOSE BUILT"
        title={<>Orthopedic Billing.<br />Surgeon-Grade Precision.</>}
        subtitle="Joint replacements, arthroscopy, spinal surgery, and implant cases demand accuracy at every billing step. We deliver it."
        ctaText="Get Your No-Cost Financial MRI"
        ctaHref="/contact"
      />
      <OrthopedicsContent />
      <SpecialtyFAQ faqs={orthopedicsFaqs} />
      <CTASection />
    </main>
  )
}
