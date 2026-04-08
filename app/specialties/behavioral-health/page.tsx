import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Behavioral Health Billing & RCM | Psychiatry, Therapy, IOP/PHP & Telehealth | Cosentus',
  description: 'Psychiatry, therapy, IOP/PHP, medication management, and telehealth each carry distinct billing rules.',
}

export default function BehavioralHealthPage() {
  return (
    <main>
      <PageHero
        label="BEHAVIORAL HEALTH"
        title="Behavioral Health Demand Is Surging. The Billing Complexity Is Surging With It."
        subtitle="Psychiatry, therapy, IOP/PHP, medication management, and telehealth each carry distinct billing rules. Our behavioral health specialists keep revenue aligned with care delivered."
        ctaText="Get Your Free Behavioral Health Revenue Analysis"
        ctaHref="/contact"
      />
      <CTASection />
    </main>
  )
}
