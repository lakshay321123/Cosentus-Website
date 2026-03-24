import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cosentus - Think Growth | Healthcare Revenue Cycle Management',
  description: 'Cosentus pioneers in transforming Practice Management & Revenue Cycle Management with AI-powered solutions.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
