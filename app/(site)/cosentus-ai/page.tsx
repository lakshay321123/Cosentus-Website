import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import { getPageData } from '@/sanity/lib/queries'
import CTASection from '@/components/sections/CTASection'
import RAPageContent from './RAPageContent'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'R+A: Real + Artificial Intelligence | How Cosentus Delivers Up to 30% Revenue Growth',
  description: '8 agents. Zero excuses. Infinite follow-ups. R+A pairs deep frontline revenue experience with AI voice agents that automate high-volume workflows.',
}

export default async function CosentusAIPage() {
  
  let page: any = null
  try { page = await getPageData('cosentus-ai') } catch (e) {}

  return (
    <main>
      <PageHero
        label="REAL + ARTIFICIAL INTELLIGENCE"
        title={page?.heroHeadline || "8 Agents. Zero Excuses. Infinite Follow-Ups."}
        subtitle={page?.heroSubtitle || "Cosentus AI agents handle the volume. Named human teams handle the judgment. Up to 30% revenue growth."}
        ctaText="Get Your Free Revenue Analysis"
        ctaHref="/contact"
      />
      <RAPageContent />
      <CTASection />
    </main>
  )
}
