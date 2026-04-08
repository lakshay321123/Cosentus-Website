import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'ASC Billing & RCM | Facility + Professional Fee Expertise | Cosentus',
  description: 'ASC billing requires coordinated facility and professional fee handling, implant accuracy, case costing, and contract monitoring.',
}

export default function ASCPage() {
  return (
    <main>
      <PageHero
        label="AMBULATORY SURGERY CENTERS"
        title="Your ASC Runs Dozens of Cases a Day. Your Billing Needs to Keep Up."
        subtitle="ASC billing requires coordinated facility and professional fee handling, implant accuracy, case costing, and contract monitoring. Cosentus ensures every case is profitable."
        ctaText="Get Your Free ASC Revenue Analysis"
        ctaHref="/contact"
      />
      <CTASection />
    </main>
  )
}
