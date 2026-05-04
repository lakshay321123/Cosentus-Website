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
      <PageHero title="Blogs" />
      <BlogContent />
    </main>
  )
}
