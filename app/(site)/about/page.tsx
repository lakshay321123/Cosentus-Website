import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import AboutContent from './AboutContent'

export const metadata: Metadata = {
  title: '25 Years of Expert-Led Revenue Cycle Management | Cosentus',
  description: 'Cosentus is a full-service practice growth partner and global healthcare revenue cycle management (RCM) company with 25+ years of experience.',
}

export default function AboutPage() {
  return (
    <main>
      {/* Band hero — same single-strip header as the Resources pages
          (Blogs etc.), per user (Jun 2026). Replaced the full video
          hero (Think Growth title + subtitle + CTA); the band variant
          renders no video, subtitle, or CTA by design. */}
      <PageHero title="About Us" band />
      <AboutContent />
      <CTASection />
    </main>
  )
}
