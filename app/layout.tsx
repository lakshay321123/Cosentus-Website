import type { Metadata } from 'next'
import { GoogleTagManager } from '@next/third-parties/google'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cosentus, Think Growth | Healthcare Revenue Cycle Management',
  description: 'Cosentus is a specialty RCM partner with 25+ years of expertise, amplified by Real + Artificial Intelligence.',
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
