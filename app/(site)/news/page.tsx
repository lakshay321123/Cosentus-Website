import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import NewsListContent from './NewsListContent'

export const metadata: Metadata = {
  title: 'Cosentus News, Healthcare RCM, AI & Medical Billing Updates',
  description: 'Stay informed with the latest healthcare RCM news, policy updates, AI innovations, and industry insights curated by Cosentus.',
}

export default function NewsPage() {
  return (
    <main>
      <PageHero title="News" band />
      <NewsListContent />
      <CTASection />
    </main>
  )
}
