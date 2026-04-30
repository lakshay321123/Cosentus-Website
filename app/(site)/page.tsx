import HeroSection from '@/components/sections/HeroSection'
import RASection from '@/components/sections/RASection'
import FinancialMRISection from '@/components/sections/FinancialMRISection'
import ResultsSection from '@/components/sections/ResultsSection'
import StatementSection from '@/components/sections/StatementSection'
import DenialPreventionSection from '@/components/sections/DenialPreventionSection'
import CaseStudiesSection from '@/components/sections/CaseStudiesSection'
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
      <FinancialMRISection />
      <ResultsSection />
      <StatementSection />
      <DenialPreventionSection />
      <CaseStudiesSection />
      <ServicesSection />
      <PartnersSection />
      <InsightsTabsSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}
