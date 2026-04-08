import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'

export const metadata: Metadata = { title: 'Privacy Policy | Cosentus' }

export default function PrivacyPage() {
  return (
    <main>
      <PageHero title="Privacy Policy" />
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <p className="section-desc" style={{ maxWidth: '100%' }}>We protect client information under HIPAA and SOC 2 standards. Full privacy policy coming soon.</p>
        </div>
      </section>
    </main>
  )
}
