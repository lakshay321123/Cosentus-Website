import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Medical Billing & Coding Services | Expert-Led, AI-Powered | Cosentus',
  description: 'Medical billing and coding for physician practices, specialty groups, and surgery centers. Maximize revenue while ensuring compliance.',
}

export default function BillingCodingPage() {
  return (
    <main>
      <PageHero
        label="MEDICAL BILLING & CODING"
        title="Expert-Led Medical Billing Across 20+ Specialties."
        subtitle="Medical billing and coding for physician practices, specialty groups, and surgery centers. One focus: maximize revenue while ensuring compliance. Powered by Real + Artificial Intelligence."
        ctaText="Get Your Free Revenue Analysis"
        ctaHref="/contact"
      />
      <CTASection />
    </main>
  )
}
