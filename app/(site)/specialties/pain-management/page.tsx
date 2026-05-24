import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import SpecialtyFAQ, { type SpecialtyFAQItem } from '@/components/sections/SpecialtyFAQ'
import PainManagementContent from './PainManagementContent'

export const metadata: Metadata = {
  title: 'Pain Management Billing & RCM | Interventional Expertise | Cosentus',
  description: 'Injections, SCS, ablations, and medication management. Coded right, authorized ahead of time, and defended when payers push back.',
}

// FAQs per Specialty Pages doc (v1, May 19 2026), section 3
// "Pain Management". 5 questions: Q1+Q2 are generic; Q3-Q5 are
// pain-specific (pre-payment reviews, SCS/interventional
// procedures, injection frequency denials).
const painManagementFaqs: SpecialtyFAQItem[] = [
  {
    question: 'Is Cosentus HIPAA compliant and SOC 2 certified?',
    answer: 'Yes. All patient data is encrypted at rest (AES-256) and in transit (TLS 1.2+). Our platform runs inside AWS with no PHI leaving the boundary. Full audit logging, role-based access control, and BAAs in place. SOC 2 is on our post-launch roadmap. The infrastructure is already built for it.',
  },
  {
    question: 'Will I get a dedicated pain management team or a shared billing pool?',
    answer: 'You get a named director, named coders, and named billing leads assigned to your account. They work pain management and only pain management. No rotating staff. They know your payers, your providers, and your procedures.',
  },
  {
    question: 'How do you handle pre-payment reviews and medical necessity audits?',
    answer: 'We prepare documentation ahead of time. Making sure clinical evidence, prior treatment history, and justification matched to each payer are in place before the claim goes out. When reviews happen, we defend with evidence, not templates.',
  },
  {
    question: 'Can you handle SCS trials, implants, and complex interventional procedures?',
    answer: 'Yes. Our team codes SCS trials and permanent implants, RFA series, and multi-level injections routinely. We track authorization requirements for each, manage the staged billing, and follow up on every dollar.',
  },
  {
    question: 'How do you deal with payers that deny based on injection frequency limits?',
    answer: 'We track frequency limits by payer and flag potential issues before submission. When denials happen, we appeal with clinical documentation showing medical necessity, treatment progression, and outcomes. Not just a generic letter.',
  },
]

export default function PainManagementPage() {
  return (
    <main>
      <PageHero videoSrc="/videos/specialty-pain-management.mp4" specialty
        label="PAIN MANAGEMENT BY COSENTUS, PURPOSE BUILT"
        title={<>Pain Management.<br />Every Procedure. Every Dollar.</>}
        subtitle="Injections, SCS, ablations, and medication management. Coded right, authorized ahead of time, and defended when payers push back."
        ctaText="Get Your No-Cost Financial MRI"
        ctaHref="/contact"
      />
      <PainManagementContent />
      <SpecialtyFAQ faqs={painManagementFaqs} />
      <CTASection />
    </main>
  )
}
