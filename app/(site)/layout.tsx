import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CindyVoiceAgent from '@/components/ui/CindyVoiceAgent'
import ChatWidget from '@/components/ui/ChatWidget'
import { ChatProvider } from '@/components/ui/ChatContext'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ChatProvider>
      <Navbar />
      {children}
      <Footer />
      <CindyVoiceAgent />
      <ChatWidget />
    </ChatProvider>
  )
}
