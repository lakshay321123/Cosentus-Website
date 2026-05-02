import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import OrthopedicsContent from './OrthopedicsContent'

export const metadata: Metadata = {
  title: 'Orthopedic Billing & RCM | Surgical Precision Meets Revenue Intelligence | Cosentus',
  description: 'Joint replacements, arthroscopy, spinal surgery, and implant cases demand surgical-grade coding and proactive contract management.',
}

export default function OrthopedicsPage() {
  return (
    <main>
      <PageHero videoSrc="/images/specialties-hero.mp4"
        label="ORTHOPEDICS BY COSENTUS, PURPOSE BUILT"
        title="Purpose Built for Orthopedics. Surgical Precision Meets Revenue Intelligence."
        subtitle="Joint replacements, arthroscopy, spinal surgery, and implant cases demand surgical-grade coding and proactive contract management. Cosentus ensures every procedure is captured, billed, and collected."
        ctaText="Get Your Free Orthopedic Revenue Analysis"
        ctaHref="/contact"
      />
      <OrthopedicsContent />
      <CTASection />
    </main>
  )
}
