import type { Metadata } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'
import { SITE_URL } from '@/lib/site-url'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Cosentus, Think Growth | Healthcare Revenue Cycle Management',
  description: 'Cosentus is a specialty RCM partner with 25+ years of expertise, amplified by Real + Artificial Intelligence.',
  // Google Search Console ownership verification. Env-driven and prod-gated,
  // mirroring the NEXT_PUBLIC_GTM_ID pattern below: set the token in Vercel
  // Production only so the tag does not appear on preview/dev deploys. When
  // set, Next renders <meta name="google-site-verification" content="…"> into
  // <head>. GA4 (measurement id G-YVRSSJTVTL) is NOT wired here — it is
  // configured as a tag inside the GTM container (NEXT_PUBLIC_GTM_ID).
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
  return (
    <html lang="en">
      {gtmId ? <GoogleTagManager gtmId={gtmId} /> : null}
      <body>{children}</body>
    </html>
  )
}
