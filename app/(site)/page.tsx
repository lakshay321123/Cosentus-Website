import HeroSection from '@/components/sections/HeroSection'
import ImmersiveVideoBackground from '@/components/sections/ImmersiveVideoBackground'
import IntroVideoSection from '@/components/sections/IntroVideoSection'
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

      {/* Page narrative flow (final spec):
            1. Hero  — H1 only, immersive video behind
            2. Intro paragraph + workflow infographic video placeholder
            3. AI agents (9 voice agents + stats + workflow panel) =
               RASection. R+A naming kept on the component file for
               history; the section now reads as "AI Agents" since
               the R+A narrative paragraph moved to IntroVideoSection.
            4. Specialties — dedicated 6-card grid, replaces former
               hero pills
            5. Results (numbers with up arrows)
            6. Resources (case studies / blog / news / events tabs)
            7. Our Network (partner logos)
            8. What Our Clients Say (testimonials)
            9. CTA  */}
      <HeroSection />
      <IntroVideoSection />
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
