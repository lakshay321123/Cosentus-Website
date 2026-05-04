import { Metadata } from 'next'
import PageBand from '@/components/sections/PageBand'
import CTASection from '@/components/sections/CTASection'
import EventsContent from './EventsContent'

export const metadata: Metadata = {
  title: 'Events | Cosentus, Healthcare RCM Conferences, Summits & Sponsorships',
  description: "There's always something happening at Cosentus. We attend and host events across healthcare RCM, medical billing, and AI, from industry conferences to community sponsorships.",
}

export default function EventsPage() {
  return (
    <main>
      <PageBand title="There's Always Something Happening at Cosentus." />

      <EventsContent />

      <CTASection />
    </main>
  )
}
