import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import ServicesSection from '@/components/sections/ServicesSection'
import ResultsSection from '@/components/sections/ResultsSection'
import CTASection from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Services | End-to-End RCM and EHR & Technology | Cosentus',
  description: 'Two integrated services built for specialty healthcare, powered by Real + Artificial Intelligence.',
}

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        label="OUR SERVICES"
        title="Everything Your Practice Needs to Grow Revenue."
        subtitle="Two integrated services built for specialty healthcare, powered by Real + Artificial Intelligence. End-to-End Revenue Cycle Management and EHR & Technology."
      />
      <ServicesSection />
      <ResultsSection />
      <CTASection />
    </main>
  )
}
