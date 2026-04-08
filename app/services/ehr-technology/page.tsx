import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'EHR Agnostic Technology & Integration | Works With Your Existing Systems | Cosentus',
  description: 'Works with your existing EHR — Epic, Athenahealth, eClinicalWorks, AdvancedMD, ModMed, nxGen, and more.',
}

export default function EHRTechnologyPage() {
  return (
    <main>
      <PageHero
        label="EHR & TECHNOLOGY"
        title="EHR Agnostic. Seamlessly Integrated With Your Existing Technology."
        subtitle="Works with your existing EHR — Epic, Athenahealth, eClinicalWorks, AdvancedMD, ModMed, nxGen, and more. No migrations. No disruption."
        ctaText="Schedule a Technology Assessment"
        ctaHref="/contact"
      />
      <CTASection />
    </main>
  )
}
