import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'

export const metadata: Metadata = { title: 'Terms of Service | Cosentus' }

export default function TermsPage() {
  return (
    <main>
      <PageHero title="Terms of Service" />
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <p className="section-desc" style={{ maxWidth: '100%' }}>Terms of service coming soon.</p>
        </div>
      </section>
    </main>
  )
}
