import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import { getPageData } from '@/sanity/lib/queries'
import CTASection from '@/components/sections/CTASection'
import AnesthesiaContent from './AnesthesiaContent'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Purpose Built for Anesthesia | Accreda by Cosentus',
  description: 'Accreda by Cosentus — 23+ years of anesthesia-specific RCM experience, backed by Real + Artificial Intelligence to capture every time unit, implant, and billable encounter.',
}

export default async function AnesthesiaPage() {
  
  let page: any = null
  try { page = await getPageData('anesthesia') } catch (e) {}

  return (
    <main>
      <PageHero videoSrc="/images/specialties-hero.mp4"
        label="ANESTHESIA — ACCREDA BY COSENTUS"
        title={page?.heroHeadline || "Beyond Billing. Built for Anesthesia."}
        subtitle={page?.heroSubtitle || "Accreda by Cosentus — 23+ years of anesthesia-specific RCM experience, backed by our Real + Artificial Intelligence operating model to capture every time unit, implant, and billable encounter."}
        ctaText="Get Your Free Anesthesia Revenue Analysis"
        ctaHref="/contact"
      />
      <AnesthesiaContent />
      <CTASection />
    </main>
  )
}
