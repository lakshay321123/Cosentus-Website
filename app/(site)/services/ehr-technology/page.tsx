import { Metadata } from 'next'
import EHRContent from './EHRContent'
import ServiceJsonLd from '@/components/ui/ServiceJsonLd'

export const metadata: Metadata = {
  title: 'EHR Agnostic Technology & Integration | Works With Your Existing Systems | Cosentus',
  description: 'Works with your existing EHR, Epic, Athenahealth, eClinicalWorks, and more. Or add Medcloud, our purpose-built PM solution. Seamlessly integrated with Real + Artificial Intelligence.',
}

export default function EHRTechnologyPage() {
  return (
    <main>
      <ServiceJsonLd path="/services/ehr-technology" />
      <EHRContent />
    </main>
  )
}
