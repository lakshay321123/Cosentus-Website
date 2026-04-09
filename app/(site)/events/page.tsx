import { Metadata } from 'next'
import fs from 'fs'
import path from 'path'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import EventsContent from './EventsContent'

export const metadata: Metadata = {
  title: 'Events | Cosentus — Healthcare RCM Conferences, Summits & Sponsorships',
  description: "There's always something happening at Cosentus. We attend and host events across healthcare RCM, medical billing, and AI — from industry conferences to community sponsorships.",
}

function getGalleryPhotos(): string[] {
  const galleryDir = path.join(process.cwd(), 'public', 'images', 'events', 'gallery')
  try {
    const files = fs.readdirSync(galleryDir)
    return files
      .filter(f => /\.(jpg|jpeg|png|webp|gif)$/i.test(f))
      .sort((a, b) => a.localeCompare(b))
      .map(f => `/images/events/gallery/${encodeURIComponent(f)}`)
  } catch (err) {
    console.error('Failed to read events gallery:', err)
    return []
  }
}

export default function EventsPage() {
  const photos = getGalleryPhotos()

  return (
    <main>
      <div style={{ position: 'relative', zIndex: 11 }}>
        <PageHero
          label="EVENTS"
          title="There's Always Something Happening at Cosentus."
          subtitle="Innovation starts with information. We attend and host events related to all our service areas, providing the latest and greatest solutions to all your business needs. Come say hello!"
        />
      </div>

      <EventsContent galleryPhotos={photos} />

      <CTASection />
    </main>
  )
}
