import { Metadata } from 'next'
import BillingCodingContent from './BillingCodingContent'
import ServiceJsonLd from '@/components/ui/ServiceJsonLd'

export const metadata: Metadata = {
  title: 'Medical Billing & Coding Services | Expert-Led, Ai-Powered | Cosentus',
  description: 'Medical billing and coding for physician practices, specialty groups, and surgery centers across 20+ specialties. Powered by Real + Artificial Intelligence.',
}

export default function BillingCodingPage() {
  return (
    <main>
      <ServiceJsonLd path="/services/billing-coding" />
      <BillingCodingContent />
    </main>
  )
}
