import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import BlogContent from './BlogContent'

export const metadata: Metadata = {
  title: 'Blog | Healthcare Billing & RCM Insights | Cosentus',
  description: 'Explore the Cosentus blog for the latest trends, tips, and insights in healthcare billing, revenue cycle management, and practice growth.',
}

export default function BlogPage() {
  return (
    <main>
      <PageHero
        label="BLOG"
        title="Healthcare Billing & RCM Insights"
        subtitle="Expert insights on medical billing, revenue cycle management, coding compliance, and practice growth strategies from the Cosentus team."
      />
      <BlogContent />
    </main>
  )
}
