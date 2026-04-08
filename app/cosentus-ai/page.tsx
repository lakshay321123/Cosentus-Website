import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RASection from '@/components/sections/RASection'

export const metadata: Metadata = {
  title: 'R+A: Real + Artificial Intelligence | How Cosentus Delivers Up to 30% Revenue Growth',
  description: '8 agents. Zero excuses. Infinite follow-ups. Real + Artificial Intelligence pairs deep frontline revenue experience with AI voice agents.',
}

export default function CosentusAIPage() {
  return (
    <main>
      <PageHero
        label="REAL + ARTIFICIAL INTELLIGENCE"
        title="8 Agents. Zero Excuses. Infinite Follow-Ups."
        subtitle="R+A pairs deep frontline revenue experience with eight AI voice agents that automate high-volume workflows, while named human teams retain accountability for coding, denials, and payer negotiation."
        ctaText="Get Your Free Revenue Analysis"
        ctaHref="/contact"
      />
      <RASection />
      <CTASection />
    </main>
  )
}
