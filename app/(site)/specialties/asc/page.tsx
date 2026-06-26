import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import SpecialtyFAQ, { type SpecialtyFAQItem } from '@/components/sections/SpecialtyFAQ'
import ASCContent from './ASCContent'
import ServiceJsonLd from '@/components/ui/ServiceJsonLd'

export const metadata: Metadata = {
  title: 'ASC Billing & RCM | Facility + Professional Fee Expertise | Cosentus',
  description: 'Coordinated facility and professional billing. Implant accuracy. Case costing. Contract management. All under one roof.',
}

// FAQs per Specialty Pages doc (v1, May 19 2026), section 4
// "ASCs". 5 questions: Q1+Q2 are generic; Q3-Q5 are ASC-
// specific (both fee streams, profitability by case type,
// implant pass-through billing).
const ascFaqs: SpecialtyFAQItem[] = [
  {
    question: 'Is Cosentus HIPAA compliant and SOC 2 certified?',
    answer: 'Yes. All patient data is encrypted at rest (AES-256) and in transit (TLS 1.2+). Our platform runs inside AWS with no PHI leaving the boundary. Full audit logging, role-based access control, and BAAs in place. SOC 2 is on our post-launch roadmap. The infrastructure is already built for it.',
  },
  {
    question: 'Will I get a dedicated ASC team or a shared billing pool?',
    answer: 'You get a named director, named coders, and named billing leads assigned to your center. They work ASC billing and only ASC billing. They understand facility fees, professional fees, and how both need to work together.',
  },
  {
    question: 'Do you handle both facility and professional fee billing?',
    answer: 'Yes. We manage both billing streams under one team. That\u2019s a big deal. Most vendors handle one or the other, which creates gaps and finger-pointing. With us, both streams are coordinated, reconciled, and followed up under one roof.',
  },
  {
    question: 'Can you help us understand profitability by case type?',
    answer: 'Yes. Our analytics show you cost vs reimbursement by procedure, surgeon, and payer. You\u2019ll know which cases are profitable, which are break-even, and which are costing you money. So you can make informed scheduling and contract decisions.',
  },
  {
    question: 'How do you handle implant billing and pass-through charges?',
    answer: 'We track implant costs from the OR records, match them to the correct billing codes, make sure pass-through documentation is accurate, and follow up on any underpayments. Implant revenue is too significant to leave to generic billing processes.',
  },
]

export default function ASCPage() {
  return (
    <main>
      <ServiceJsonLd path="/specialties/asc" />
      <PageHero videoSrc="/videos/specialty-asc.mp4" specialty
        label="ASC BY COSENTUS, PURPOSE BUILT"
        title={<>Ambulatory Services.<br />Three Specialties. One Expert Team.</>}
        subtitle={
          <>
            <span style={{ fontSize: '1.2em' }}>Orthopedics</span>, <span style={{ fontSize: '1.2em' }}>pain management</span>, and <span style={{ fontSize: '1.2em' }}>ASC billing</span> each carry distinct coding rules and denial patterns. We manage all three under one roof, with full transparency.
          </>
        }
        ctaText="Get Your No-Cost Financial MRI"
        ctaHref="/contact"
      />
      <ASCContent />
      <SpecialtyFAQ faqs={ascFaqs} />
      <CTASection />
    </main>
  )
}
