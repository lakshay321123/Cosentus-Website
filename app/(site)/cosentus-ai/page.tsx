import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RAPageContent from './RAPageContent'

export const metadata: Metadata = {
  title: 'Real People + AI | Cosentus Revenue Cycle Management',
  description: 'Nine voice agents and twenty-three modules handle the volume. Specialty-trained billing teams handle the judgment. End-to-end revenue cycle management for specialty practices.',
}

export default function CosentusAIPage() {
  return (
    <main>
      <PageHero
        label="Zeus"
        title={<>RCM that <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>thinks.</span></>}
        subtitle="Cosentus was built around AI from day one. That means every module shares context with every other module. Eligibility errors inform coding rules, denial patterns retrain claim scrubbing, payer behavior updates A/R follow-up. Most platforms can’t do that because their AI was added later."
        ctaText="Get Your Financial MRI"
        ctaHref="/contact"
      />
      <RAPageContent />
      <CTASection />
    </main>
  )
}
