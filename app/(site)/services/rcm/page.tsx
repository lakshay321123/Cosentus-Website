import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import { getPageData } from '@/sanity/lib/queries'
import CTASection from '@/components/sections/CTASection'
import RCMContent from './RCMContent'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Comprehensive Revenue Cycle Management | End-to-End RCM | Cosentus',
  description: 'We manage your entire revenue cycle — patient registration to final payment — with specialty-trained teams and Real + Artificial Intelligence.',
}

export default async function RCMPage() {
  
  let page: any = null
  try { page = await getPageData('rcm') } catch (e) {}

  return (
    <main>
      <PageHero
        label="COMPREHENSIVE RCM"
        title={page?.heroHeadline || "End-to-End Revenue Cycle Management. Every Step. Every Dollar."}
        subtitle={page?.heroSubtitle || "We manage your entire revenue cycle — patient registration to final payment — with specialty-trained teams and Real + Artificial Intelligence eliminating revenue leakage at every stage."}
        ctaText="Get Your Free Comprehensive RCM Assessment"
        ctaHref="/contact"
      />
      <RCMContent />
      <CTASection />
    </main>
  )
}
