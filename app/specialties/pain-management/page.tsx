import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'

export const metadata: Metadata = {
  title: 'Pain Management Billing & RCM | Interventional Expertise | Cosentus',
  description: 'Interventional injections, SCS, radiofrequency ablation, and medication management demand precise coding and authorization management.',
}

export default function PainManagementPage() {
  return (
    <main>
      <PageHero
        label="PAIN MANAGEMENT"
        title="Pain Management Revenue Gets Lost Between Clinical Complexity and Payer Scrutiny."
        subtitle="Interventional injections, SCS, radiofrequency ablation, and medication management demand precise coding and authorization management. Our pain management experts ensure every high-value procedure is billed and defended."
        ctaText="Get Your Free Pain Management Revenue Analysis"
        ctaHref="/contact"
      />
      <CTASection />
    </main>
  )
}
