import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import RCMContent from './RCMContent'
import RCMFAQ from './RCMFAQ'
import ServiceJsonLd from '@/components/ui/ServiceJsonLd'

export const metadata: Metadata = {
  alternates: { canonical: '/services/rcm' },
  title: 'End-to-End Revenue Cycle Management | Every Step. Every Dollar. | Cosentus',
  description: 'We manage your entire revenue cycle, patient registration to final payment, with specialty-trained teams and Real + Artificial Intelligence.',
}

/* RCM 360 page section order (top → bottom):
     1. PageHero        — title + subtitle + CTA button
     2. RCMContent      — Challenge / Problem-Solution / 10 Steps /
                          ResultsSection-on-teal
     3. TestimonialsSection
     4. CTASection
     5. RCMFAQ          — last section on the page

   Previous order had CTASection before TestimonialsSection, and FAQ
   was the last block INSIDE RCMContent (so it rendered before
   Testimonials and CTA). User direction May 2026: 'Faq in Rcm 360
   needs to be the last section after Testimonials, and testimonials
   needs to be above CTA section.' This file is the source of truth
   for that ordering; FAQ moved out of RCMContent into its own
   component (RCMFAQ.tsx) so this file controls every bottom-of-page
   section directly. */
export default function RCMPage() {
  return (
    <main>
      <ServiceJsonLd path="/services/rcm" />
      <PageHero
        label="END-TO-END RCM"
        title="End-to-End Revenue Cycle Management. Every Step. Every Dollar."
        subtitle="We manage your entire revenue cycle, patient registration to final payment, with specialty-trained teams and Real + Artificial Intelligence eliminating revenue leakage at every stage."
        ctaText="Get Your No-Cost Financial MRI"
        ctaHref="/contact"
      />
      <RCMContent />
      <TestimonialsSection />
      <CTASection />
      <RCMFAQ />
    </main>
  )
}
