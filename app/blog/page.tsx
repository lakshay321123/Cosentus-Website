import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import BlogContent from './BlogContent'

export const metadata: Metadata = {
  title: 'Healthcare RCM Blog & AI Innovations Insights | Cosentus',
  description: 'Insights, updates, and thought leadership on healthcare revenue cycle management, AI innovations, and medical billing best practices.',
}

export default function BlogPage() {
  return (
    <main>
      <PageHero
        label="BLOG"
        title="Insights & Thought Leadership"
        subtitle="Expert perspectives on healthcare revenue cycle management, AI innovations, coding updates, and billing best practices."
      />
      <BlogContent />
    </main>
  )
}
