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
        titleLogo={
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/images/zeus-hlth-white.png"
            alt="ZEUS HLTH"
            style={{ height: 'clamp(30px, 3.4vw, 46px)', width: 'auto', display: 'block' }}
          />
        }
        title={<>Ai-native RCM platform<br />that integrates with <span style={{ color: '#00B5D6', fontStyle: 'italic' }}>any EHR.</span></>}
        subtitle="Run by real specialty experts."
        ctaText="Request Demo"
        ctaHref="/contact"
        videoSrc="/videos/zeus-hero.mp4"
      />
      <RAPageContent />
      <CTASection />
    </main>
  )
}
