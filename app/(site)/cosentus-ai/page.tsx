import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RAPageContent from './RAPageContent'

export const metadata: Metadata = {
  title: 'R+A: Real + Artificial Intelligence | How Cosentus Delivers Up to 30% Revenue Growth',
  description: '9 agents. Zero excuses. Infinite follow-ups. R+A pairs deep frontline revenue experience with AI voice agents that automate high-volume workflows.',
}

export default function CosentusAIPage() {
  return (
    <main>
      <PageHero
        label="Zeus"
        title={<>RCM that <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>thinks.</span></>}
        subtitle="AI at the core — not bolted on. 23 modules, 15 AI features, 45+ specialties. Built from day one."
        ctaText="Get Your Financial MRI"
        ctaHref="/contact"
      />
      <RAPageContent />
      <CTASection />
    </main>
  )
}
