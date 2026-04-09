'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

type State = 'hidden' | 'greeting' | 'idle' | 'listening' | 'thinking' | 'speaking'

export default function CindyVoiceAgent() {
  const [state, setState] = useState<State>('hidden')
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [mouthOpen, setMouthOpen] = useState(false)
  const [blinking, setBlinking] = useState(false)
  const [conversationOn, setConversationOn] = useState(false)

  const stateRef = useRef<State>('hidden')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const messagesRef = useRef<{ role: string; text: string }[]>([])
  const processingRef = useRef(false)
  const conversationOnRef = useRef(false)
  const speakResolveRef = useRef<(() => void) | null>(null) // To interrupt speech
  const router = useRouter()
  const pathname = usePathname()
  const pathnameRef = useRef(pathname)

  useEffect(() => { stateRef.current = state }, [state])
  useEffect(() => { pathnameRef.current = pathname }, [pathname])
  useEffect(() => { conversationOnRef.current = conversationOn }, [conversationOn])

  useEffect(() => {
    if (!sessionStorage.getItem('cindy-greeted')) {
      const t = setTimeout(() => { setShowPopup(true); setState('greeting') }, 3000)
      return () => clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    const id = setInterval(() => { setBlinking(true); setTimeout(() => setBlinking(false), 150) }, 3500)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (state !== 'speaking') { setMouthOpen(false); return }
    const id = setInterval(() => setMouthOpen(p => !p), 130)
    return () => clearInterval(id)
  }, [state])

  function doNavigate(route: string, scroll?: string) {
    if (pathnameRef.current !== route) {
      router.push(route)
      if (scroll) setTimeout(() => document.getElementById(scroll)?.scrollIntoView({ behavior: 'smooth' }), 1000)
    } else if (scroll) {
      document.getElementById(scroll)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // ===== INTERRUPTIBLE speak =====
  // Returns a promise that resolves when audio ends OR when stopAudio() is called
  function speakText(text: string): Promise<void> {
    return new Promise(async (resolve) => {
      // Store resolve ref so stopAudio can trigger it
      speakResolveRef.current = resolve

      // Clean previous audio
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
      speechSynthesis.cancel()

      try {
        const res = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text }),
        })
        if (res.ok) {
          const blob = await res.blob()
          const url = URL.createObjectURL(blob)
          const audio = new Audio(url)
          audioRef.current = audio

          audio.onended = () => {
            URL.revokeObjectURL(url)
            audioRef.current = null
            speakResolveRef.current = null
            resolve()
          }
          audio.onerror = () => {
            URL.revokeObjectURL(url)
            audioRef.current = null
            speakResolveRef.current = null
            resolve()
          }
          await audio.play().catch(() => {
            audioRef.current = null
            speakResolveRef.current = null
            resolve()
          })
          return // Don't resolve here — wait for onended
        }
      } catch (e) {
        console.error('TTS failed:', e)
      }

      // Fallback browser TTS
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 0.95; u.pitch = 1.05
      u.onend = () => { speakResolveRef.current = null; resolve() }
      u.onerror = () => { speakResolveRef.current = null; resolve() }
      speechSynthesis.speak(u)
    })
  }

  // ===== Stop audio AND resolve the speakText promise =====
  function stopAudio() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    speechSynthesis.cancel()
    // Resolve the pending speakText promise so the flow continues
    if (speakResolveRef.current) {
      speakResolveRef.current()
      speakResolveRef.current = null
    }
  }

  // ===== Process → AI → Speak → Auto-listen =====
  async function processMessage(userText: string) {
    if (processingRef.current) return
    processingRef.current = true
    setState('thinking')
    setTranscript('')

    messagesRef.current.push({ role: 'user', text: userText })

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messagesRef.current], voiceMode: true }),
      })
      const data = await res.json()
      const aiText = data.text || "Sorry, could you say that again?"
      messagesRef.current.push({ role: 'bot', text: aiText })

      if (data.navigate) doNavigate(data.navigate.route, data.navigate.scroll)

      setState('speaking')
      setResponse(aiText)
      await speakText(aiText) // This resolves on end OR on stopAudio()

      processingRef.current = false
      if (conversationOnRef.current) {
        setState('listening')
        setTimeout(() => {
          if (conversationOnRef.current) beginRecognition()
        }, 400)
      } else {
        setState('idle')
      }
    } catch {
      processingRef.current = false
      setState('idle')
    }
  }

  // ===== Recognition =====
  function beginRecognition() {
    try { recognitionRef.current?.stop() } catch {}
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)

    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'

    let accumulated = ''
    let sent = false

    rec.onresult = (event: any) => {
      let final = '', interim = ''
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript
        else interim += event.results[i][0].transcript
      }
      accumulated = (final + interim).trim()
      setTranscript(accumulated)

      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = setTimeout(() => {
        if (accumulated.trim() && !sent) {
          sent = true
          try { rec.stop() } catch {}
          processMessage(accumulated.trim())
        }
      }, 2000)
    }

    rec.onend = () => {
      if (!sent && accumulated.trim()) {
        sent = true
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
        processMessage(accumulated.trim())
      } else if (!sent && conversationOnRef.current) {
        setTimeout(() => {
          if (conversationOnRef.current && stateRef.current !== 'thinking' && stateRef.current !== 'speaking') {
            beginRecognition()
          }
        }, 200)
      }
    }

    rec.onerror = (e: any) => {
      if (e.error === 'no-speech' && conversationOnRef.current) {
        setTimeout(() => {
          if (conversationOnRef.current && stateRef.current !== 'thinking' && stateRef.current !== 'speaking') {
            beginRecognition()
          }
        }, 200)
      }
    }

    recognitionRef.current = rec
    rec.start()
  }

  function startConversation() {
    setConversationOn(true)
    conversationOnRef.current = true
    processingRef.current = false
    setState('listening')
    beginRecognition()
  }

  function endConversation() {
    setConversationOn(false)
    conversationOnRef.current = false
    processingRef.current = false
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    try { recognitionRef.current?.stop() } catch {}
    stopAudio()
    setState('idle')
  }

  function acceptGreeting() {
    sessionStorage.setItem('cindy-greeted', 'true')

    // Add greeting to conversation memory so AI won't repeat it
    const greetingText = "Hey! I'm Cindy, your AI guide for the Cosentus website. Just talk to me naturally. Ask me anything or tell me where you'd like to go!"
    messagesRef.current.push({ role: 'bot', text: greetingText })

    ;(async () => {
      setState('speaking')
      setResponse(greetingText)
      await speakText(greetingText)
      startConversation()
    })()
  }

  function dismissCindy() {
    sessionStorage.setItem('cindy-greeted', 'true')
    endConversation()
    setDismissed(true)
    setShowPopup(false)
    setState('hidden')
  }

  // Handle clicking the avatar/panel while Cindy is speaking = interrupt
  function handlePanelClick() {
    if (stateRef.current === 'speaking') {
      stopAudio()
    }
  }

  const showMini = dismissed || state === 'hidden'
  if (!showPopup && !dismissed && state === 'hidden') return null

  return (
    <>
      {showMini && (
        <button onClick={() => { setDismissed(false); setShowPopup(true); setState('idle') }} aria-label="Talk to Cindy" style={{ position: 'fixed', bottom: 110, right: 28, zIndex: 9998, width: 56, height: 56, borderRadius: '50%', border: '3px solid #00B5D6', overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'white', boxShadow: '0 4px 20px rgba(0,181,214,0.3)', animation: 'cindyPulse 2s ease-in-out infinite' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cindy.png" alt="Cindy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </button>
      )}

      {showPopup && !dismissed && (
        <div style={{ position: 'fixed', bottom: 110, right: 28, zIndex: 9998, width: 320, borderRadius: 20, overflow: 'hidden', background: 'white', border: '2px solid #00B5D6', boxShadow: '0 20px 60px rgba(0,181,214,0.25)', animation: 'cindySlideUp 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
          <button onClick={dismissCindy} style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', fontSize: 14 }}>✕</button>

          {/* Click avatar area to interrupt */}
          <div onClick={handlePanelClick} style={{ background: 'linear-gradient(135deg, #00B5D6 0%, #0090A8 100%)', padding: '24px 24px 32px', textAlign: 'center', cursor: state === 'speaking' ? 'pointer' : 'default' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', margin: '0 auto 12px', border: '3px solid white', overflow: 'hidden', position: 'relative', boxShadow: state === 'listening' ? '0 0 0 4px rgba(255,255,255,0.4), 0 0 20px rgba(255,255,255,0.3)' : '0 4px 16px rgba(0,0,0,0.2)', animation: state === 'speaking' ? 'cindyBob 0.4s ease-in-out infinite' : state === 'listening' ? 'cindyGlow 1.5s ease-in-out infinite' : 'cindyBreathe 3s ease-in-out infinite' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/cindy.png" alt="Cindy" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: blinking ? 'scaleY(0.97)' : 'scaleY(1)', transition: 'transform 0.1s ease' }} />
              {state === 'speaking' && <div style={{ position: 'absolute', bottom: '22%', left: '50%', transform: 'translateX(-50%)', width: mouthOpen ? 14 : 10, height: mouthOpen ? 8 : 3, background: 'rgba(180,80,80,0.7)', borderRadius: '50%', transition: 'all 0.08s ease' }} />}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {state === 'listening' && <div style={{ display: 'flex', gap: 3 }}>{[0,1,2,3,4].map(i => <div key={i} style={{ width: 3, background: 'white', borderRadius: 2, animation: 'cindyWave 0.8s ease-in-out infinite', animationDelay: `${i*0.1}s` }} />)}</div>}
              <span style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>
                {state === 'greeting' ? 'Hey there!' : state === 'listening' ? 'Listening...' : state === 'thinking' ? 'Thinking...' : state === 'speaking' ? 'Tap me to interrupt' : 'Cindy — AI Guide'}
              </span>
            </div>
          </div>

          <div style={{ padding: '20px 24px', minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {state === 'greeting' ? (
              <>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: '#333', margin: '0 0 16px' }}>Hi! I&apos;m <strong style={{ color: '#00B5D6' }}>Cindy</strong>, your AI voice guide. I can navigate this website and answer any questions. Ready?</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={acceptGreeting} style={{ flex: 1, background: '#00B5D6', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Start Conversation</button>
                  <button onClick={dismissCindy} style={{ padding: '12px 16px', background: '#f0f0f0', color: '#666', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer' }}>Later</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: '#555', marginBottom: 12, textAlign: 'center', minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {state === 'listening' && transcript ? <p style={{ color: '#00B5D6', fontStyle: 'italic', margin: 0 }}>&ldquo;{transcript}&rdquo;</p>
                  : state === 'listening' ? <p style={{ margin: 0, color: '#00B5D6', fontSize: 12 }}>Go ahead, I&apos;m listening...</p>
                  : state === 'thinking' ? <div style={{ display: 'flex', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00B5D6', animation: 'dotBounce 1.4s infinite' }} /><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00B5D6', animation: 'dotBounce 1.4s infinite', animationDelay: '0.2s' }} /><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00B5D6', animation: 'dotBounce 1.4s infinite', animationDelay: '0.4s' }} /></div>
                  : (state === 'speaking' || state === 'idle') && response ? <p style={{ margin: 0, fontSize: 11, color: '#999', maxHeight: 50, overflow: 'hidden' }}>{response.substring(0, 120)}{response.length > 120 ? '...' : ''}</p>
                  : <p style={{ margin: 0, color: '#999', fontSize: 12 }}>Tap below to start talking</p>}
                </div>
                {conversationOn ? (
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
        @keyframes dotBounce { 0%,80%,100% { transform: scale(0); } 40% { transform: scale(1); } }
      `}</style>
    </>
  )
}
