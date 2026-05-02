import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cosentus, Think Growth | Healthcare Revenue Cycle Management',
  description: 'Cosentus is a specialty RCM partner with 25+ years of expertise, amplified by Real + Artificial Intelligence.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
