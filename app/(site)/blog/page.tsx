import { Metadata } from 'next'
import PageBand from '@/components/sections/PageBand'
import BlogContent from './BlogContent'

export const metadata: Metadata = {
  title: 'Blog | Healthcare Billing & RCM Insights | Cosentus',
  description: 'Explore the Cosentus blog for the latest trends, tips, and insights in healthcare billing, revenue cycle management, and practice growth.',
}

export default function BlogPage() {
  return (
    <main>
      <PageBand title="Healthcare Billing & RCM Insights" />
      <BlogContent />
    </main>
  )
}
