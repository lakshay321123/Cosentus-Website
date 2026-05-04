import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import PartnershipContent from './PartnershipContent'

export const metadata: Metadata = {
  title: 'Healthcare RCM Partnership Solutions, Partner With Cosentus',
  description: 'Cosentus has emerged as the preferred partner of choice for billing companies across America. 1,000+ RCM experts, cutting-edge AI, and 19 successful acquisitions.',
}

export default function PartnershipPage() {
  return (
    <main>
      <PageHero title="Partnership" />

      <PartnershipContent />
    </main>
  )
}
