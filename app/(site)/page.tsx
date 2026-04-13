import HeroSection from '@/components/sections/HeroSection'
import RASection from '@/components/sections/RASection'
import ResultsSection from '@/components/sections/ResultsSection'
import StatementSection from '@/components/sections/StatementSection'
import CaseStudiesSection from '@/components/sections/CaseStudiesSection'
import AdvantagesSection from '@/components/sections/AdvantagesSection'
import PlatformSection from '@/components/sections/PlatformSection'
import ServicesSection from '@/components/sections/ServicesSection'
import PartnersSection from '@/components/sections/PartnersSection'
import CTASection from '@/components/sections/CTASection'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <RASection />
      <ResultsSection />
      <StatementSection />
      <CaseStudiesSection />
      <AdvantagesSection />
      <PlatformSection />
      <ServicesSection />
      <PartnersSection />
      <CTASection />
    </main>
  )
}
