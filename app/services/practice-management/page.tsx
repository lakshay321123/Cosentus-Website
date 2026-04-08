import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Complete Practice Management Services | Cosentus',
  description: 'We manage the operational complexity of running a medical practice — front desk to credentialing, reporting, and consulting.',
}

export default function PracticeManagementPage() {
  return (
    <main>
      <PageHero
        label="COMPLETE PRACTICE MANAGEMENT"
        title="Run a More Profitable Practice Without Adding to Your Workload."
        subtitle="We manage the operational complexity of running a medical practice — front desk to credentialing, reporting, and consulting — so your clinical team focuses on patients."
        ctaText="Get Your Free Practice Assessment"
        ctaHref="/contact"
      />
      <CTASection />
    </main>
  )
}
