import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import EventsContent from './EventsContent'

export const metadata: Metadata = {
  alternates: { canonical: '/events' },
  title: 'Events | Cosentus, Healthcare RCM Conferences, Summits & Sponsorships',
  description: "There's always something happening at Cosentus. We attend and host events across healthcare RCM, medical billing, and Ai, from industry conferences to community sponsorships.",
}

export default function EventsPage() {
  return (
    <main>
      <PageHero title="Events" band />

      <EventsContent />

      <CTASection />
    </main>
  )
}
