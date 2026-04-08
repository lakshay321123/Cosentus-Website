import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ChatWidget from '@/components/ui/ChatWidget'
import { ChatProvider } from '@/components/ui/ChatContext'

export const metadata: Metadata = {
  title: 'Cosentus — Think Growth | Healthcare Revenue Cycle Management',
  description: 'Cosentus is a specialty RCM partner with 25+ years of expertise, amplified by Real + Artificial Intelligence. Get your free revenue analysis today.',
  openGraph: {
    title: 'Cosentus — Revenue Intelligence Delivered',
    description: '25 years of specialty RCM expertise, amplified by Real + Artificial Intelligence.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ChatProvider>
          <Navbar />
          {children}
          <Footer />
          <ChatWidget />
        </ChatProvider>
      </body>
    </html>
  )
}
