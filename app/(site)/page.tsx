import HeroSection from '@/components/sections/HeroSection'
import ImmersiveVideoBackground from '@/components/sections/ImmersiveVideoBackground'
import ScrollHeroSection from '@/components/sections/ScrollHeroSection'
import RASection from '@/components/sections/RASection'
import SpecialtiesSection from '@/components/sections/SpecialtiesSection'
import ResultsSection from '@/components/sections/ResultsSection'
import RCMCalculatorSection from '@/components/sections/RCMCalculatorSection'
import PartnersSection from '@/components/sections/PartnersSection'
import InsightsTabsSection from '@/components/sections/InsightsTabsSection'
import TestimonialsShuffleSection from '@/components/sections/TestimonialsShuffleSection'
import FAQSection from '@/components/sections/FAQSection'
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

      {/* Page narrative flow:
            1. HeroSection — "Purpose Built / For Your Specialty /
               Real People + AI. / RCM Redefined." (4-line typing
               tagline; never meant to be removed).
            2. ScrollHeroSection — DNA helix video + "Combining
               expert teams..." paragraph. This is a normal in-page
               section (scroll-hijack removed from the underlying
               component per user direction).
            3. RASection — 9 AI voice agents + stats
            4. SpecialtiesSection — 6-card grid
            5. ResultsSection — numbers with up arrows
            6. RCMCalculatorSection — live "what could you recover"
               calculator. Sits after Results so the narrative flows
               "here's what we deliver" → "now see what those numbers
               mean for YOUR practice". 3 inputs, 3-bucket breakdown,
               existing site-wide CTA to /contact.
            7. InsightsTabsSection — Resources tabs
            8. PartnersSection — Our Network
            9. TestimonialsShuffleSection — What Our Clients Say
               (home-only fan-stack glass-card variant; other pages
               still use the shared TestimonialsSection carousel)
           10. FAQSection — 3 priority FAQs with arrow-disc
               expander. Full /faqs index page exists but is
               intentionally NOT in the global nav.
           11. CTASection */}
      <HeroSection />
      <ScrollHeroSection />
      <RASection />
      <SpecialtiesSection />
      <ResultsSection />
      <RCMCalculatorSection />
      <InsightsTabsSection />
      <PartnersSection />
      <TestimonialsShuffleSection title={<>What Our <span style={{ color: '#00B5D6' }}>Clients</span> Say</>} />
      <FAQSection />
      <CTASection />
    </main>
  )
}
