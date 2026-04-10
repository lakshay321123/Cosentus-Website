import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import EventsContent from './EventsContent'

export const metadata: Metadata = {
  title: 'Events | Cosentus — Healthcare RCM Conferences, Summits & Sponsorships',
  description: "There's always something happening at Cosentus. We attend and host events across healthcare RCM, medical billing, and AI — from industry conferences to community sponsorships.",
}

export default function EventsPage() {
  return (
    <main>
      <PageHero
        label="EVENTS"
        title="There's Always Something Happening at Cosentus."
        subtitle="Innovation starts with information. We attend and host events related to all our service areas, providing the latest and greatest solutions to all your business needs. Come say hello!"
      />

      <EventsContent />

      <CTASection />
    </main>
  )
}
