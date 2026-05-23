import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import InsightSection from '@/components/insights/InsightSection'
import { InsightCardData } from '@/components/insights/InsightCard'
import { blogPosts } from '@/data/blogPosts'
import { newsArticles } from '@/data/newsArticles'
import { eventsData } from '@/data/eventsData'

export const metadata: Metadata = {
  title: 'Resources | Cosentus',
  description: 'Case studies, blog posts, news, and events from Cosentus. One place for everything we publish.',
}

// ---------- Case Studies ----------
// Single source of truth: 3 production case studies with on-disk PDFs.
// (Matches CaseStudiesSection.tsx — the homepage already shows these.)
const caseStudyItems: InsightCardData[] = [
  {
    href: '/casestudies-wp',
    title: '15-surgeon ASC. Days in AR 75 → 37. Clean claims 83% → 98%. Collections doubled.',
    image: '/images/homepage/surgery-center.jpg',
    tag: 'ASC',
  },
  {
    href: '/casestudies-wp',
    title: 'Multi-modality pain clinic. E&M documentation + ultrasound coding + electronic WC submission. 26% revenue increase.',
    image: '/images/homepage/doctor-consult.jpg',
    tag: 'Pain Management',
  },
  {
    href: '/casestudies-wp',
    title: '$1.5M to $2.2M. Workers\u2019 Comp turnaround cut from 45 to 28 days.',
    image: '/images/homepage/medical-tech.jpg',
    tag: 'Orthopedic',
  },
]

// ---------- Blog ----------
// 53 posts in src/data/blogPosts.ts. Show all so Load More works through them.
// Order preserved as authored — newest content lives at the top of the data file.
const blogItems: InsightCardData[] = blogPosts.map(p => ({
  href: `/blog/${p.slug}`,
  title: p.title,
  image: p.coverImage,
  tag: p.tag,
}))

// ---------- News & Press ----------
// 45 articles. Sort by date descending (most recent first).
const newsItems: InsightCardData[] = [...newsArticles]
  .sort((a, b) => {
    // Date strings like "April 7, 2026" — Date constructor handles them
    const da = new Date(a.date).getTime() || 0
    const db = new Date(b.date).getTime() || 0
    return db - da
  })
  .map(a => ({
    href: `/in-news/${encodeURIComponent(a.slug)}`,
    title: a.title,
    date: a.date,
    tag: a.tag,
    image: a.coverImage,
    // Articles without a coverImage fall back to the brand gradient in InsightCard
  }))

// ---------- Events ----------
// 24 events. Sort by sortDate (ISO) descending. No detail route exists yet,
// so each card links to /events#slug so the user lands on the events page.
const eventItems: InsightCardData[] = [...eventsData]
  .sort((a, b) => b.sortDate.localeCompare(a.sortDate))
  .map(e => ({
    href: `/events#${e.slug}`,
    title: e.title,
    date: e.date,
    tag: e.tag,
    image: e.photos?.[0],
    // Events without a photo fall back to the brand gradient in InsightCard
  }))

export default function InsightsPage() {
  return (
    <main>
      {/* band: solid brand-teal band (~220px desktop / 160px mobile).
          label + subtitle are kept in source as documentation but
          the component intentionally suppresses them in band mode
          — the 4 sections below this hero (Case Studies, Blog,
          News, Events) already serve as the directory the subtitle
          described. */}
      <PageHero
        band
        label="INSIGHTS"
        title="What We're Publishing."
        subtitle="Case studies, blog posts, news, and events from Cosentus, all in one place."
      />

      <InsightSection
        label="CLIENT SUCCESS STORIES"
        title="Client Success Stories"
        items={caseStudyItems}
        viewAllHref="/casestudies-wp"
        ctaLabel="Read Client Success Story"
      />

      <InsightSection
        label="BLOG"
        title="From the Blog"
        items={blogItems}
        viewAllHref="/blog"
        ctaLabel="Read Article"
        alt
      />

      <InsightSection
        label="NEWS & PRESS"
        title="News &amp; Press"
        items={newsItems}
        viewAllHref="/in-news"
        ctaLabel="Read More"
      />

      <InsightSection
        label="EVENTS"
        title="Where You Can Find Us"
        items={eventItems}
        viewAllHref="/events"
        ctaLabel="View Event"
        alt
      />

      <CTASection />
    </main>
  )
}
