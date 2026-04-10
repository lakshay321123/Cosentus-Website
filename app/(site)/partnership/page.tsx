import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import PartnershipContent from './PartnershipContent'

export const metadata: Metadata = {
  title: 'Healthcare RCM Partnership Solutions — Partner With Cosentus',
  description: 'Cosentus has emerged as the preferred partner of choice for billing companies across America. 1,000+ RCM experts, cutting-edge AI, and 19 successful acquisitions.',
}

export default function PartnershipPage() {
  return (
    <main>
      <PageHero
        label="PARTNERSHIP"
        title="Grow Your Business with Innovative Solutions"
        subtitle="Cosentus has emerged as the preferred partner of choice for billing companies across America. Our dedicated team of 1,000+ RCM experts ensures cost-effectiveness and maximized operational efficiencies."
        ctaText="Schedule a Call"
        ctaHref="/contact"
      />

      <PartnershipContent />
    </main>
  )
}
