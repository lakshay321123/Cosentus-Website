'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ConversationProvider, useConversation } from '@elevenlabs/react'

const AGENT_ID = 'agent_4401knqw7z4ees28j1wgmdwq7t6r'

function CindyInner() {
  const [showPopup, setShowPopup] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [blinking, setBlinking] = useState(false)
  const [mouthOpen, setMouthOpen] = useState(false)
  const [navMessage, setNavMessage] = useState('')
  const mouthRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()

  const conversation = useConversation({
    onConnect: () => console.log('Cindy connected'),
    onDisconnect: () => console.log('Cindy disconnected'),
    onError: (error: string) => console.error('Cindy error:', error),
    onMessage: (msg: { source: string; message: string }) => {
      console.log('Message:', msg.source, msg.message)
    },
    clientTools: {
      // This tool gets called when the AI decides to navigate
      navigate: (params: { path: string; section?: string }) => {
        console.log('Cindy navigating to:', params.path, params.section)
        setNavMessage(`Navigating to ${params.path}...`)
        router.push(params.path)
        if (params.section) {
          setTimeout(() => {
            document.getElementById(params.section!)?.scrollIntoView({ behavior: 'smooth' })
          }, 1000)
        }
        return `Navigated to ${params.path}`
      },
    },
  })

  const { status, isSpeaking } = conversation
  const isConnected = status === 'connected'
  const isListening = isConnected && !isSpeaking

  // Greeting after 3s
  useEffect(() => {
    if (!sessionStorage.getItem('cindy-greeted')) {
      const t = setTimeout(() => setShowPopup(true), 3000)
      return () => clearTimeout(t)
    }
  }, [])

  // Blink
  useEffect(() => {
    const id = setInterval(() => { setBlinking(true); setTimeout(() => setBlinking(false), 150) }, 3500)
    return () => clearInterval(id)
  }, [])

  // Mouth
  useEffect(() => {
    if (isSpeaking) {
      mouthRef.current = setInterval(() => setMouthOpen(p => !p), 130)
    } else {
      if (mouthRef.current) clearInterval(mouthRef.current)
      setMouthOpen(false)
    }
    return () => { if (mouthRef.current) clearInterval(mouthRef.current) }
  }, [isSpeaking])

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      conversation.startSession({
        agentId: AGENT_ID,
        connectionType: 'websocket',
      })
    } catch (e) {
      console.error('Failed to start conversation:', e)
    }
  }, [conversation])

  const endConversation = useCallback(() => {
    conversation.endSession()
  }, [conversation])

  const acceptGreeting = () => {
    sessionStorage.setItem('cindy-greeted', 'true')
    startConversation()
  }

  const dismissCindy = () => {
    sessionStorage.setItem('cindy-greeted', 'true')
    if (isConnected) conversation.endSession()
    setDismissed(true)
    setShowPopup(false)
  }

  const stateLabel = !isConnected ? 'Cindy — AI Guide' : isSpeaking ? 'Speaking...' : 'Listening...'
  if (!showPopup && !dismissed) return null

  return (
    <>
      {(dismissed || !showPopup) && dismissed && (
        <button onClick={() => { setDismissed(false); setShowPopup(true) }} aria-label="Talk to Cindy" style={{ position: 'fixed', bottom: 110, right: 28, zIndex: 9998, width: 56, height: 56, borderRadius: '50%', border: '3px solid #00B5D6', overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'white', boxShadow: '0 4px 20px rgba(0,181,214,0.3)', animation: 'cindyPulse 2s ease-in-out infinite' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cindy.png" alt="Cindy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </button>
      )}

      {showPopup && !dismissed && (
        <div style={{ position: 'fixed', bottom: 110, right: 28, zIndex: 9998, width: 320, borderRadius: 20, overflow: 'hidden', background: 'white', border: '2px solid #00B5D6', boxShadow: '0 20px 60px rgba(0,181,214,0.25)', animation: 'cindySlideUp 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
          <button onClick={dismissCindy} style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', fontSize: 14 }}>✕</button>

          <div style={{ background: 'linear-gradient(135deg, #00B5D6 0%, #0090A8 100%)', padding: '24px 24px 32px', textAlign: 'center' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', margin: '0 auto 12px', border: '3px solid white', overflow: 'hidden', position: 'relative', boxShadow: isListening ? '0 0 0 4px rgba(255,255,255,0.4), 0 0 20px rgba(255,255,255,0.3)' : '0 4px 16px rgba(0,0,0,0.2)', animation: isSpeaking ? 'cindyBob 0.4s ease-in-out infinite' : isListening ? 'cindyGlow 1.5s ease-in-out infinite' : 'cindyBreathe 3s ease-in-out infinite' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/cindy.png" alt="Cindy" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: blinking ? 'scaleY(0.97)' : 'scaleY(1)', transition: 'transform 0.1s ease' }} />
              {isSpeaking && <div style={{ position: 'absolute', bottom: '22%', left: '50%', transform: 'translateX(-50%)', width: mouthOpen ? 14 : 10, height: mouthOpen ? 8 : 3, background: 'rgba(180,80,80,0.7)', borderRadius: '50%', transition: 'all 0.08s ease' }} />}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {isListening && <div style={{ display: 'flex', gap: 3 }}>{[0,1,2,3,4].map(i => <div key={i} style={{ width: 3, background: 'white', borderRadius: 2, animation: 'cindyWave 0.8s ease-in-out infinite', animationDelay: `${i*0.1}s` }} />)}</div>}
              <span style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>{stateLabel}</span>
            </div>
          </div>

          <div style={{ padding: '20px 24px', minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {!isConnected && !sessionStorage.getItem('cindy-greeted') ? (
              <>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: '#333', margin: '0 0 16px' }}>
                  Hi! I&apos;m <strong style={{ color: '#00B5D6' }}>Cindy</strong>, your AI voice guide. I can navigate this website and answer any questions. Ready?
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={acceptGreeting} style={{ flex: 1, background: '#00B5D6', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Start Conversation</button>
                  <button onClick={dismissCindy} style={{ padding: '12px 16px', background: '#f0f0f0', color: '#666', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer' }}>Later</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 12, lineHeight: 1.5, color: '#888', marginBottom: 12, textAlign: 'center', minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isConnected ? (
                    <p style={{ margin: 0, color: '#00B5D6' }}>Go ahead, just talk naturally...</p>
                  ) : (
                    <p style={{ margin: 0, color: '#999' }}>Tap below to start a conversation</p>
                  )}
                </div>
                {isConnected ? (
                  <button onClick={endConversation} style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1px solid #ddd', cursor: 'pointer', background: 'white', color: '#999', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    End Conversation
                  </button>
                ) : (
                  <button onClick={startConversation} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer', background: '#00B5D6', color: 'white', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
                    Start Conversation
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes cindySlideUp { from { opacity: 0; transform: translateY(40px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cindyPulse { 0%,100% { box-shadow: 0 4px 20px rgba(0,181,214,0.3); } 50% { box-shadow: 0 4px 20px rgba(0,181,214,0.6), 0 0 0 6px rgba(0,181,214,0.15); } }
        @keyframes cindyBreathe { 0%,100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        @keyframes cindyBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        @keyframes cindyGlow { 0%,100% { box-shadow: 0 0 0 4px rgba(255,255,255,0.3); } 50% { box-shadow: 0 0 0 8px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.4); } }
        @keyframes cindyWave { 0%,100% { height: 8px; } 50% { height: 20px; } }
      `}</style>
    </>
  )
}

// Wrapper with ConversationProvider (required by @elevenlabs/react v1.x)
export default function CindyVoiceAgent() {
  return (
    <ConversationProvider>
      <CindyInner />
    </ConversationProvider>
  )
}
