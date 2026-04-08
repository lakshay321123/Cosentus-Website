import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RAPageContent from './RAPageContent'

export const metadata: Metadata = {
  title: 'R+A: Real + Artificial Intelligence | How Cosentus Delivers Up to 30% Revenue Growth',
  description: '8 agents. Zero excuses. Infinite follow-ups. R+A pairs deep frontline revenue experience with AI voice agents that automate high-volume workflows.',
}

export default function CosentusAIPage() {
  return (
    <main>
      <PageHero
        label="REAL + ARTIFICIAL INTELLIGENCE"
        title="8 Agents. Zero Excuses. Infinite Follow-Ups."
        subtitle="R+A pairs deep frontline revenue experience with eight AI voice agents that automate high-volume workflows, while named human teams retain accountability for coding, denials, and payer negotiation. Most clients see measurable improvement in 3–6 months and up to 30% revenue growth within 12 months."
        ctaText="Get Your Free Revenue Analysis"
        ctaHref="/contact"
      />
      <RAPageContent />
      <CTASection />
    </main>
  )
}
