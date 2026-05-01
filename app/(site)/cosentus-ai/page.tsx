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
        label="REAL + ARTIFICIAL INTELLIGENCE"
        title="9 Agents. Zero Excuses. Infinite Follow-Ups."
        subtitle="Cosentus AI agents handle the volume. Named human teams handle the judgment. Up to 30% revenue growth."
        ctaText="Get Your Financial MRI"
        ctaHref="/contact"
      />
      <RAPageContent />
      <CTASection />
    </main>
  )
}
