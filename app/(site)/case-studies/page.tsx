import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CaseStudiesSection from '@/components/sections/CaseStudiesSection'
import CTASection from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Client Results: Real Practices, Real Revenue Growth | Cosentus',
  description: 'Every practice we partner with has a unique revenue story. Outcome-first client success stories demonstrating the concrete impact of our R+A model.',
}

export default function CaseStudiesPage() {
  return (
    <main>
      <PageHero
        label="CLIENT SUCCESS STORIES"
        title="Real Practices. Real Revenue Growth."
        subtitle="Every practice we partner with has a unique revenue story. Below are outcome-first client success stories demonstrating the concrete impact of our Real + Artificial Intelligence model."
      />
      <CaseStudiesSection mode="viewer" />
      <CTASection />
    </main>
  )
}
