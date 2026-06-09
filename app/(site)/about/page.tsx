import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import AboutContent from './AboutContent'

export const metadata: Metadata = {
  title: '25 Years of Expert-Led Revenue Cycle Management | Cosentus',
  description: 'Cosentus is a full-service practice growth partner and global healthcare revenue cycle management (RCM) company with 25+ years of experience.',
}

export default function AboutPage() {
  return (
    <main>
      <PageHero
        label="ABOUT COSENTUS"
        title={<>Think Growth.<br />We&rsquo;ll Handle the Revenue Cycle.</>}
        subtitle="Specialty-focused. AI-native. Built to help you collect more of what you've earned."
        subtitleMaxWidth="none"
        ctaText="Let's Talk"
        ctaHref="/contact"
      />
      <AboutContent />
      <CTASection />
    </main>
  )
}
