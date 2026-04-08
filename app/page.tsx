import HeroSection from '@/components/sections/HeroSection'
import TestimonialsTicker from '@/components/sections/TestimonialsTicker'
import RASection from '@/components/sections/RASection'
import ResultsSection from '@/components/sections/ResultsSection'
import CaseStudiesSection from '@/components/sections/CaseStudiesSection'
import AdvantagesSection from '@/components/sections/AdvantagesSection'
import ServicesSection from '@/components/sections/ServicesSection'
import CTASection from '@/components/sections/CTASection'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TestimonialsTicker />
      <RASection />
      <ResultsSection />
      <CaseStudiesSection />
      <AdvantagesSection />
      <ServicesSection />
      <CTASection />
    </main>
  )
}
