import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RCMContent from './RCMContent'

export const metadata: Metadata = {
  title: 'End-to-End Revenue Cycle Management | Every Step. Every Dollar. | Cosentus',
  description: 'We manage your entire revenue cycle — patient registration to final payment — with specialty-trained teams and Real + Artificial Intelligence.',
}

export default function RCMPage() {
  return (
    <main>
      <PageHero
        label="END-TO-END RCM"
        title="End-to-End Revenue Cycle Management. Every Step. Every Dollar."
        subtitle="We manage your entire revenue cycle — patient registration to final payment — with specialty-trained teams and Real + Artificial Intelligence eliminating revenue leakage at every stage."
        ctaText="Get Your Financial MRI"
        ctaHref="/contact"
      />
      <RCMContent />
      <CTASection />
    </main>
  )
}
