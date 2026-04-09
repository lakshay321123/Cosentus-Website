import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import ServicesSection from '@/components/sections/ServicesSection'
import ResultsSection from '@/components/sections/ResultsSection'
import CTASection from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Services | Revenue Cycle, Billing, Practice Management & Technology | Cosentus',
  description: 'Four integrated services built for specialty healthcare, powered by Real + Artificial Intelligence.',
}

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        label="OUR SERVICES"
        title="Everything Your Practice Needs to Grow Revenue."
        subtitle="Four integrated services built for specialty healthcare, powered by Real + Artificial Intelligence. Use individually or combine for a complete revenue ecosystem."
      />
      <ServicesSection />
      <ResultsSection />
      <CTASection />
    </main>
  )
}
