import ImmersiveVideoBackground from '@/components/sections/ImmersiveVideoBackground'
import ScrollHeroSection from '@/components/sections/ScrollHeroSection'
import RASection from '@/components/sections/RASection'
import SpecialtiesSection from '@/components/sections/SpecialtiesSection'
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

      {/* Page narrative flow (current spec):
            1. ScrollHeroSection — scroll-expand DNA video hero;
               replaces previous HeroSection + IntroVideoSection.
               IMPORTANT: this component hijacks page scroll until
               the media is fully expanded, so it MUST stay at the
               top of the page. Do not insert anything above it.
            2. AI agents (9 voice agents + stats) = RASection
            3. Specialties — dedicated 6-card grid
            4. Results (numbers with up arrows)
            5. Resources (case studies / blog / news / events tabs)
            6. Our Network (partner logos)
            7. What Our Clients Say (testimonials)
            8. CTA  */}
      <ScrollHeroSection />
      <RASection />
      <SpecialtiesSection />
      <ResultsSection />
      <InsightsTabsSection />
      <PartnersSection />
      <TestimonialsSection title={<>What Our <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Clients</span> Say.</>} />
      <CTASection />
    </main>
  )
}
