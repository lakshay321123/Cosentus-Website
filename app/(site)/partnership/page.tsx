import { Metadata } from 'next'
import PageBand from '@/components/sections/PageBand'
import PartnershipContent from './PartnershipContent'

export const metadata: Metadata = {
  title: 'Healthcare RCM Partnership Solutions, Partner With Cosentus',
  description: 'Cosentus has emerged as the preferred partner of choice for billing companies across America. 1,000+ RCM experts, cutting-edge AI, and 19 successful acquisitions.',
}

export default function PartnershipPage() {
  return (
    <main>
      <PageBand title="Grow Your Business with Innovative Solutions" />

      <PartnershipContent />
    </main>
  )
}
