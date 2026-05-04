import { Metadata } from 'next'
import PageBand from '@/components/sections/PageBand'
import CaseStudiesSection from '@/components/sections/CaseStudiesSection'
import CTASection from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Client Results: Real Practices, Real Revenue Growth | Cosentus',
  description: 'Every practice we partner with has a unique revenue story. Outcome-first client success stories demonstrating the concrete impact of our R+A model.',
}

export default function CaseStudiesPage() {
  return (
    <main>
      <PageBand title="Client Stories" />
      <CaseStudiesSection mode="viewer" />
      <CTASection />
    </main>
  )
}
