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
        subtitle="23 modules. 15 AI features. 45+ specialties. Run by AI, accountable to specialty-trained teams."
        ctaText="Get Your Financial MRI"
        ctaHref="/contact"
      />
      <RAPageContent />
      <CTASection />
    </main>
  )
}
