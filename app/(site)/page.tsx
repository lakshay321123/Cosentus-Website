import HeroSection from '@/components/sections/HeroSection'
import RASection from '@/components/sections/RASection'
import ResultsSection from '@/components/sections/ResultsSection'
import StatementSection from '@/components/sections/StatementSection'
import CaseStudiesSection from '@/components/sections/CaseStudiesSection'
import ServicesSection from '@/components/sections/ServicesSection'
import PartnersSection from '@/components/sections/PartnersSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CTASection from '@/components/sections/CTASection'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <RASection />
      <ResultsSection />
      <StatementSection />
      <CaseStudiesSection />
      <ServicesSection />
      <PartnersSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}
