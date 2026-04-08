import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'

export const metadata: Metadata = {
  title: 'News & Events | Cosentus',
  description: 'Industry events, speaking engagements, and company news from Cosentus.',
}

export default function NewsEventsPage() {
  return (
    <main>
      <PageHero label="NEWS & EVENTS" title="News & Events" subtitle="Industry events, speaking engagements, and company news. Coming soon." />
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <p className="section-desc" style={{ margin: '0 auto', textAlign: 'center' }}>News and events coming soon.</p>
        </div>
      </section>
    </main>
  )
}
