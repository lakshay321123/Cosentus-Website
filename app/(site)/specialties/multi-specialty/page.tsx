import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import SpecialtyFAQ, { type SpecialtyFAQItem } from '@/components/sections/SpecialtyFAQ'
import MultiSpecialtyContent from './MultiSpecialtyContent'
import ServiceJsonLd from '@/components/ui/ServiceJsonLd'

export const metadata: Metadata = {
  title: 'Multi-Specialty Billing & RCM | One Team. Every Department. | Cosentus',
  description: 'Multi-specialty practices face different codes, different payers, and different rules across every department. One RCM partner that manages it all without dropping the ball.',
}

// FAQs per Specialty Pages doc (v1, May 19 2026), section 6
// "Multi-Specialty". 5 questions: Q1+Q2 are the generic
// pair shared across all specialty pages (HIPAA/SOC 2 + named
// team); Q3-Q5 are multi-specialty-specific (handling 5+
// specialties, single unified dashboard, scaling with new
// specialties/locations).
const multiSpecialtyFaqs: SpecialtyFAQItem[] = [
  {
    question: 'Is Cosentus HIPAA compliant and SOC 2 certified?',
    answer: 'Yes. All patient data is encrypted at rest (AES-256) and in transit (TLS 1.2+). Our platform runs inside AWS with no PHI leaving the boundary. Full audit logging, role-based access control, and BAAs in place. SOC 2 is on our post-launch roadmap. The infrastructure is already built for it.',
  },
  {
    question: 'Will I get a dedicated team or a shared billing pool?',
    answer: 'You get a named director and a dedicated billing team assigned to your practice. For multi-specialty groups, our team is trained across all your service lines. But they work your account and only your account.',
  },
  {
    question: 'Can you handle 5+ specialties under one practice without losing quality?',
    answer: 'Yes. That\u2019s exactly what we\u2019re built for. We don\u2019t just throw one generalist at your account. We assign a team that\u2019s been trained across the specific specialties you run and we track quality metrics by department so nothing slips.',
  },
  {
    question: 'Will we get one dashboard for all specialties or separate reports?',
    answer: 'One dashboard. You\u2019ll see performance by specialty, by provider, by payer, and by denial category. All in one view. No more piecing together reports from different systems.',
  },
  {
    question: 'What if we add a new specialty or location later?',
    answer: 'We scale with you. Adding a new department or location means expanding the team\u2019s coverage. Same director, same process, same dashboard. We\u2019ve done this with clients who\u2019ve grown from a handful of providers to multi-site operations.',
  },
]

export default function MultiSpecialtyPage() {
  return (
    <main>
      <ServiceJsonLd path="/specialties/multi-specialty" />
      <PageHero videoSrc="/videos/specialty-multi-specialty.mp4" specialty
        label="MULTI-SPECIALTY BY COSENTUS"
        title={<>Multi-Specialty.<br />One Team. Every Department.</>}
        subtitle="Different codes, different payers, different rules across every department. You need a partner that can manage all of them without dropping the ball."
        ctaText="Get Your No-Cost Financial MRI"
        ctaHref="/contact"
      />
      <MultiSpecialtyContent />
      <SpecialtyFAQ faqs={multiSpecialtyFaqs} />
      <CTASection />
    </main>
  )
}
