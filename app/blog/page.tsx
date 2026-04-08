import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'

export const metadata: Metadata = {
  title: 'Blog | Cosentus',
  description: 'Insights, updates, and thought leadership from the Cosentus team.',
}

export default function BlogPage() {
  return (
    <main>
      <PageHero label="BLOG" title="Insights & Updates" subtitle="Thought leadership and industry insights from the Cosentus team. Coming soon." />
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container">
          <p className="section-desc" style={{ margin: '0 auto', textAlign: 'center' }}>Blog posts coming soon. Check back for the latest in RCM, AI, and healthcare revenue intelligence.</p>
        </div>
      </section>
    </main>
  )
}
