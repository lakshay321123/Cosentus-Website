import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import ResourcesContent from './ResourcesContent'

export const metadata: Metadata = {
  title: 'Case Studies & White Papers | Cosentus',
  description: 'Real outcomes from real practices. Download case studies and white papers showing how Cosentus delivers measurable revenue growth.',
}

export default function ResourcesPage() {
  return (
    <main>
      <PageHero
        label="RESOURCES"
        title="Real Outcomes. Real Practices."
        subtitle="Every figure is documented. Every result is linked to methodology. Download case studies and white papers to see how Real + Artificial Intelligence delivers measurable revenue growth."
        ctaText="Get Your Free Revenue Analysis"
        ctaHref="/contact"
      />
      <ResourcesContent />
      <CTASection />
    </main>
  )
}
