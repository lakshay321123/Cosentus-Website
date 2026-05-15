import HeroSection from '@/components/sections/HeroSection'
import ImmersiveVideoBackground from '@/components/sections/ImmersiveVideoBackground'
import RASection from '@/components/sections/RASection'
import ResultsSection from '@/components/sections/ResultsSection'
import PartnersSection from '@/components/sections/PartnersSection'
import InsightsTabsSection from '@/components/sections/InsightsTabsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import CTASection from '@/components/sections/CTASection'

export default function Home() {
  return (
    <main className="home-immersive">
      {/* Page-wide fixed video background; behind all sections at
          z-index: -1. Renders on BOTH desktop and mobile (mobile uses
          a portrait 9:16 cut of the same content, ~1.9MB). The loop
          seam is hidden via a JS-driven crossfade between two stacked
          <video> elements. See the component for details. */}
      <ImmersiveVideoBackground />
      <HeroSection />
      <RASection />
      <ResultsSection />
      <InsightsTabsSection />
      <PartnersSection />
      <TestimonialsSection title={<>What Our <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Clients</span> Say.</>} />
      <CTASection />
    </main>
  )
}
