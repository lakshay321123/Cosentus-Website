import HeroSection from '@/components/sections/HeroSection'
import ImmersiveVideoBackground from '@/components/sections/ImmersiveVideoBackground'
// import ScrollHeroSection from '@/components/sections/ScrollHeroSection' // hidden per user (Jun 2026); un-comment with the usage below to restore the workflow animation
import RASection from '@/components/sections/RASection'
import SpecialtiesSection from '@/components/sections/SpecialtiesSection'
import ResultsSection from '@/components/sections/ResultsSection'
import RCMCalculatorSection from '@/components/sections/RCMCalculatorSection'
import PartnersSection from '@/components/sections/PartnersSection'
import InsightsTabsSection from '@/components/sections/InsightsTabsSection'
import TestimonialsShuffleSection from '@/components/sections/TestimonialsShuffleSection'
import FAQSection from '@/components/sections/FAQSection'
import CTASection from '@/components/sections/CTASection'
import OrganizationJsonLd from '@/components/ui/OrganizationJsonLd'

export default function Home() {
  return (
    <main className="home-immersive">
      <OrganizationJsonLd />
      {/* Page-wide fixed video background; behind all sections at
          z-index: -1. Renders on BOTH desktop and mobile (mobile uses
          a portrait 9:16 cut of the same content, ~1.9MB). The loop
          seam is hidden via a JS-driven crossfade between two stacked
          <video> elements. See the component for details. */}
      <ImmersiveVideoBackground />

      {/* Page narrative flow:
            1. HeroSection — "Specialty-focused RCM. Built to collect
               every dollar." headline + subline + 2 CTAs (Change 1).
               The three hero cards were removed (Change 2).
            2. ResultsSection (intro) — six glass up-arrow stats with a
               centered intro paragraph below them. Moved here directly
               after the hero (Change 3) so the numbers — what really
               sells — sit high on the page. The `intro` prop renders
               the homepage-only paragraph beneath the arrows.
            3. RCMCalculatorSection — live "what could you recover"
               calculator. 3 inputs, 3-bucket breakdown, existing
               site-wide CTA to /contact. Moved directly below the
               Results stats so the interactive "what am I leaving on
               the table" moment sits high on the page, right after the
               numbers that motivate it.
            4. TestimonialsShuffleSection — What Our Clients Say
               (home-only fan-stack glass-card variant; other pages
               still use the shared TestimonialsSection carousel).
               Moved directly below the calculator so client proof
               immediately follows the "what could you recover" moment.
            5. ScrollHeroSection — DNA helix video + "Combining
               expert teams..." paragraph. This is a normal in-page
               section (scroll-hijack removed from the underlying
               component per user direction).
            6. RASection — 9 AI voice agents + stats
            7. SpecialtiesSection — 6-card grid
            8. InsightsTabsSection — Resources tabs
            9. PartnersSection — Our Network
           10. FAQSection — 3 priority FAQs with arrow-disc
               expander. Full /faqs index page exists but is
               intentionally NOT in the global nav.
           11. CTASection */}
      <HeroSection />
      <ResultsSection intro darkMode showArrows />
      <RCMCalculatorSection />
      <TestimonialsShuffleSection title={<>What Our <span style={{ color: '#00B5D6' }}>Clients</span> Say</>} />
      {/* ScrollHeroSection (Real + AI workflow animation) hidden per
          user direction (Jun 2026). Un-comment this AND its import at
          the top of the file to restore the animated workflow section. */}
      {/* <ScrollHeroSection /> */}
      <RASection />
      <SpecialtiesSection />
      <InsightsTabsSection />
      <PartnersSection />
      <FAQSection />
      <CTASection />
    </main>
  )
}
