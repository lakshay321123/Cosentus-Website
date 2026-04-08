import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import ResultsSection from '@/components/sections/ResultsSection'
import CTASection from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Comprehensive Revenue Cycle Management | End-to-End RCM | Cosentus',
  description: 'We manage your entire revenue cycle — patient registration to final payment — with specialty-trained teams and Real + Artificial Intelligence.',
}

export default function RCMPage() {
  return (
    <main>
      <PageHero
        label="COMPREHENSIVE RCM"
        title="End-to-End Revenue Cycle Management. Every Step. Every Dollar."
        subtitle="We manage your entire revenue cycle — patient registration to final payment — with specialty-trained teams and Real + Artificial Intelligence eliminating revenue leakage at every stage."
        ctaText="Get Your Free Comprehensive RCM Assessment"
        ctaHref="/contact"
      />
      <ResultsSection />
      <CTASection />
    </main>
  )
}
