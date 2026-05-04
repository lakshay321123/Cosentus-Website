import HeroSection from '@/components/sections/HeroSection'
import RASection from '@/components/sections/RASection'
import ResultsSection from '@/components/sections/ResultsSection'
import StatementSection from '@/components/sections/StatementSection'
import ServicesSection from '@/components/sections/ServicesSection'
import PartnersSection from '@/components/sections/PartnersSection'
import InsightsTabsSection from '@/components/sections/InsightsTabsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CTASection from '@/components/sections/CTASection'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <RASection />
      <ResultsSection />
      <StatementSection />
      <InsightsTabsSection />
      <ServicesSection />
      <PartnersSection />
      <TestimonialsSection title={<>What Our <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Clients</span> Say.</>} />
      <CTASection />
    </main>
  )
}
