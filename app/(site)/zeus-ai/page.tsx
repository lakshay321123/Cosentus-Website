import { Metadata } from 'next'
import PageHero from '@/components/sections/PageHero'
import CTASection from '@/components/sections/CTASection'
import RAPageContent from './RAPageContent'

export const metadata: Metadata = {
  title: 'Real People + Ai | Cosentus Revenue Cycle Management',
  description: 'Nine voice agents and twenty-three modules handle the volume. Specialty-trained billing teams handle the judgment. End-to-end revenue cycle management for specialty practices.',
}

export default function CosentusAIPage() {
  return (
    <main>
      <PageHero
        label="Zeus"
        title={<>Ai-native RCM platform that integrates with any EHR. <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>Run by real specialty experts.</span></>}
        subtitle="Built around Ai from day one, Cosentus RCM 360 connects eligibility, coding, claims, denials, A/R, and payments. So every signal improves the next action."
        ctaText="Get Your Financial MRI"
        ctaHref="/contact"
        videoSrc="/videos/zeus-hero.mp4"
      />
      <RAPageContent />
      <CTASection />
    </main>
  )
}
