import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import AnesthesiaContent from './AnesthesiaContent'

export const metadata: Metadata = {
  title: 'Purpose Built for Anesthesia | Accreda by Cosentus',
  description: 'Accreda by Cosentus — 23+ years of anesthesia-specific RCM experience, backed by Real + Artificial Intelligence to capture every time unit, implant, and billable encounter.',
}

export default function AnesthesiaPage() {
  return (
    <main>
      <PageHero videoSrc="/images/specialties-hero.mp4"
        label="ACCREDA BY COSENTUS — PURPOSE BUILT FOR ANESTHESIA"
        title="Beyond Billing. Built for Anesthesia."
        subtitle="Accreda by Cosentus — 23+ years of anesthesia-specific RCM experience, backed by our Real + Artificial Intelligence operating model to capture every time unit, implant, and billable encounter."
        ctaText="Get Your Free Anesthesia Revenue Analysis"
        ctaHref="/contact"
      />
      <AnesthesiaContent />
      <CTASection />
    </main>
  )
}
