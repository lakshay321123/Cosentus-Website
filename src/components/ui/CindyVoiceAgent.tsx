'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'

type CindyState = 'hidden' | 'greeting' | 'idle' | 'listening' | 'thinking' | 'speaking'

export default function CindyVoiceAgent() {
  const [state, setState] = useState<CindyState>('hidden')
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [mouthOpen, setMouthOpen] = useState(false)
  const [blinking, setBlinking] = useState(false)
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const messagesRef = useRef<{ role: string; text: string }[]>([])
  const conversationActiveRef = useRef(false)
  const stateRef = useRef<CindyState>('hidden')

  // Keep stateRef in sync
  useEffect(() => { stateRef.current = state }, [state])

  // Show greeting after 3s
  useEffect(() => {
    const seen = sessionStorage.getItem('cindy-greeted')
    if (!seen) {
      const t = setTimeout(() => { setShowPopup(true); setState('greeting') }, 3000)
      return () => clearTimeout(t)
    }
  }, [])

  // Blink loop
  useEffect(() => {
    const id = setInterval(() => { setBlinking(true); setTimeout(() => setBlinking(false), 150) }, 3000 + Math.random() * 2000)
    return () => clearInterval(id)
  }, [])

  // Mouth animation
  useEffect(() => {
    if (state !== 'speaking') { setMouthOpen(false); return }
    const id = setInterval(() => setMouthOpen(p => !p), 120 + Math.random() * 80)
    return () => clearInterval(id)
  }, [state])

  // Navigate
  const navigate = useCallback((route: string, scroll?: string) => {
    if (pathname !== route) {
      router.push(route)
      if (scroll) setTimeout(() => document.getElementById(scroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 1000)
    } else if (scroll) {
      document.getElementById(scroll)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [pathname, router])

  // Core: start speech recognition
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return

    // Don't start if already listening or speaking
    if (stateRef.current === 'listening' || stateRef.current === 'thinking') return

    // Stop any playing audio
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    speechSynthesis.cancel()

    setState('listening')
    setTranscript('')

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    let lastResultTime = Date.now()
    let accumulatedText = ''

    recognition.onresult = (event: any) => {
      let final = ''
      let interim = ''
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript
        else interim += event.results[i][0].transcript
      }
      accumulatedText = (final + interim).trim()
      setTranscript(accumulatedText)
      lastResultTime = Date.now()

      // Clear previous timer
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)

      // After 2.5 seconds of silence, send the message
      silenceTimerRef.current = setTimeout(() => {
        if (accumulatedText.trim()) {
          try { recognition.stop() } catch {}
          recognitionRef.current = null
          processUserMessage(accumulatedText.trim())
        }
      }, 2500)
    }

    recognition.onend = () => {
      // Only process if we have text and haven't already sent
      if (stateRef.current === 'listening' && accumulatedText.trim()) {
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
        processUserMessage(accumulatedText.trim())
      } else if (stateRef.current === 'listening') {
        // No speech detected - stay idle
        setState('idle')
      }
    }

    recognition.onerror = (e: any) => {
      if (e.error !== 'no-speech' && e.error !== 'aborted') {
        console.error('Speech error:', e.error)
      }
      if (stateRef.current === 'listening') setState('idle')
    }

    recognitionRef.current = recognition
    recognition.start()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Process user message → AI → Speak → Auto-restart
  const processUserMessage = useCallback(async (text: string) => {
    setState('thinking')
    messagesRef.current.push({ role: 'user', text })

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesRef.current, voiceMode: true }),
      })
      const data = await res.json()
      const aiText = data.text || "Sorry, could you say that again?"
      messagesRef.current.push({ role: 'bot', text: aiText })

      // Navigate IMMEDIATELY — don't wait for speech to finish
      if (data.navigate) {
        navigate(data.navigate.route, data.navigate.scroll)
      }

      // Speak the response (navigation already happening in parallel)
      setState('speaking')
      setResponse(aiText)

      let spoken = false
      let interrupted = false

      // Start background speech detection for auto-interrupt
      let interruptRecognition: any = null
      try {
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
        if (SR) {
          interruptRecognition = new SR()
          interruptRecognition.continuous = false
          interruptRecognition.interimResults = true
          interruptRecognition.lang = 'en-US'
          let wordCount = 0
          interruptRecognition.onresult = (event: any) => {
            // Only interrupt if user said actual words (not just noise/breathing)
            const text = event.results[0]?.[0]?.transcript?.trim() || ''
            const confidence = event.results[0]?.[0]?.confidence || 0
            wordCount = text.split(/\s+/).filter((w: string) => w.length > 0).length
            
            // Require at least 2 words OR a final result with 1+ words
            if ((wordCount >= 2) || (event.results[0]?.isFinal && text.length > 3 && confidence > 0.7)) {
              interrupted = true
              if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
              speechSynthesis.cancel()
              try { interruptRecognition.stop() } catch {}
            }
          }
          interruptRecognition.onerror = () => {}
          interruptRecognition.start()
        }
      } catch {}

      // Try ElevenLabs
      try {
        const ttsRes = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: aiText }),
        })

        if (ttsRes.ok && !interrupted) {
          const blob = await ttsRes.blob()
          const url = URL.createObjectURL(blob)
          const audio = new Audio(url)
          audioRef.current = audio

          await new Promise<void>((resolve) => {
            audio.onended = () => { URL.revokeObjectURL(url); resolve() }
            audio.onerror = () => { URL.revokeObjectURL(url); resolve() }
            audio.onpause = () => { URL.revokeObjectURL(url); resolve() } // Handle interrupt pause
            audio.play().catch(() => resolve())
          })
          spoken = true
        }
      } catch (e) {
        console.error('TTS failed:', e)
      }

      // Fallback: browser TTS
      if (!spoken && !interrupted) {
        await new Promise<void>((resolve) => {
          const utterance = new SpeechSynthesisUtterance(aiText)
          utterance.rate = 0.95
          utterance.pitch = 1.05
          const voices = speechSynthesis.getVoices()
          const female = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google UK English Female'))
          if (female) utterance.voice = female
          utterance.onend = () => resolve()
          utterance.onerror = () => resolve()
          speechSynthesis.speak(utterance)
        })
      }

      // Clean up interrupt recognition
      try { interruptRecognition?.stop() } catch {}

      // If interrupted, go straight to listening
      if (interrupted) {
        setState('idle')
        setTimeout(() => startListening(), 200)
        return
      }

      // Auto-restart listening if conversation is active
      setState('idle')
      if (conversationActiveRef.current) {
        setTimeout(() => {
          if (conversationActiveRef.current && stateRef.current === 'idle') {
            startListening()
          }
        }, 600)
      }
    } catch {
      setState('idle')
      setResponse("Having trouble connecting. Try again in a moment.")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, startListening])

  // Stop everything
  const stopAll = () => {
    conversationActiveRef.current = false
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    try { recognitionRef.current?.stop() } catch {}
    recognitionRef.current = null
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    speechSynthesis.cancel()
    setState('idle')
  }

  const acceptGreeting = () => {
    sessionStorage.setItem('cindy-greeted', 'true')
    conversationActiveRef.current = true
    setState('idle')
    // Don't speak intro - just show text and start listening
    setResponse("Hey! I'm Cindy. Ask me anything or say where you'd like to go!")
    setTimeout(() => startListening(), 500)
  }

  const dismissCindy = () => {
    sessionStorage.setItem('cindy-greeted', 'true')
    stopAll()
    setDismissed(true)
    setShowPopup(false)
    setState('hidden')
  }

  const handleMicClick = () => {
    if (state === 'listening' || state === 'speaking') {
      stopAll()
    } else {
      conversationActiveRef.current = true
      startListening()
    }
  }

  const showMiniAvatar = dismissed || state === 'hidden'
  if (!showPopup && !dismissed && state === 'hidden') return null

  return (
    <>
      {showMiniAvatar && (
        <button onClick={() => { setDismissed(false); setShowPopup(true); setState('idle') }}
          aria-label="Talk to Cindy"
          style={{ position: 'fixed', bottom: 110, right: 28, zIndex: 9998, width: 56, height: 56, borderRadius: '50%', border: '3px solid #00B5D6', overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'white', boxShadow: '0 4px 20px rgba(0,181,214,0.3)', animation: 'cindyPulse 2s ease-in-out infinite' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cindy.png" alt="Cindy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </button>
      )}

      {showPopup && !dismissed && (
        <div style={{ position: 'fixed', bottom: 110, right: 28, zIndex: 9998, width: 320, borderRadius: 20, overflow: 'hidden', background: 'white', border: '2px solid #00B5D6', boxShadow: '0 20px 60px rgba(0,181,214,0.25), 0 8px 32px rgba(0,0,0,0.1)', animation: 'cindySlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <button onClick={dismissCindy} style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', fontSize: 14 }}>✕</button>

          <div style={{ background: 'linear-gradient(135deg, #00B5D6 0%, #0090A8 100%)', padding: '24px 24px 32px', textAlign: 'center' }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%', margin: '0 auto 12px',
              border: '3px solid white', overflow: 'hidden', position: 'relative',
              boxShadow: state === 'listening' ? '0 0 0 4px rgba(255,255,255,0.4), 0 0 20px rgba(255,255,255,0.3)' : '0 4px 16px rgba(0,0,0,0.2)',
              animation: state === 'speaking' ? 'cindyBob 0.4s ease-in-out infinite' : state === 'listening' ? 'cindyGlow 1.5s ease-in-out infinite' : 'cindyBreathe 3s ease-in-out infinite',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/cindy.png" alt="Cindy" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: blinking ? 'scaleY(0.97)' : 'scaleY(1)', transition: 'transform 0.1s ease' }} />
              {state === 'speaking' && <div style={{ position: 'absolute', bottom: '22%', left: '50%', transform: 'translateX(-50%)', width: mouthOpen ? 14 : 10, height: mouthOpen ? 8 : 3, background: 'rgba(180,80,80,0.7)', borderRadius: '50%', transition: 'all 0.08s ease' }} />}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {state === 'listening' && <div style={{ display: 'flex', gap: 3 }}>{[0,1,2,3,4].map(i => <div key={i} style={{ width: 3, background: 'white', borderRadius: 2, animation: 'cindyWave 0.8s ease-in-out infinite', animationDelay: `${i*0.1}s` }} />)}</div>}
              <span style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>
                {state === 'greeting' ? 'Hey there!' : state === 'listening' ? 'Listening...' : state === 'thinking' ? 'Thinking...' : state === 'speaking' ? 'Speaking...' : 'Cindy — AI Guide'}
              </span>
            </div>
          </div>

          <div style={{ padding: '20px 24px', minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {state === 'greeting' ? (
              <>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: '#333', margin: '0 0 16px' }}>
                  Hi! I&apos;m <strong style={{ color: '#00B5D6' }}>Cindy</strong>, your AI voice guide. I can navigate this website and answer any questions. Ready?
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={acceptGreeting} style={{ flex: 1, background: '#00B5D6', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Talk to Cindy</button>
                  <button onClick={dismissCindy} style={{ padding: '12px 16px', background: '#f0f0f0', color: '#666', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer' }}>Later</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: '#333', marginBottom: 16, minHeight: 48, maxHeight: 120, overflowY: 'auto' }}>
                  {state === 'listening' && transcript && <p style={{ color: '#00B5D6', fontStyle: 'italic', margin: 0 }}>&ldquo;{transcript}&rdquo;</p>}
                  {state === 'thinking' && <div style={{ display: 'flex', gap: 4 }}>{[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#00B5D6', animation: 'dotBounce 1.4s infinite', animationDelay: `${i*0.2}s` }} />)}</div>}
                  {(state === 'speaking' || state === 'idle') && response && <p style={{ margin: 0 }}>{response}</p>}
                  {state === 'idle' && !response && <p style={{ margin: 0, color: '#999' }}>Tap the mic and ask me anything.</p>}
                  {state === 'listening' && !transcript && <p style={{ margin: 0, color: '#999' }}>I&apos;m listening... speak naturally, I&apos;ll wait for you to finish.</p>}
                </div>

                <button onClick={handleMicClick} disabled={state === 'thinking'}
                  style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: state === 'thinking' ? 'wait' : 'pointer', background: state === 'listening' ? '#ff4444' : state === 'speaking' ? '#ff8800' : '#00B5D6', color: 'white', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s ease' }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                  {state === 'listening' ? 'Tap to Stop' : state === 'speaking' ? 'Speaking...' : 'Tap to Talk'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes cindySlideUp { from { opacity: 0; transform: translateY(40px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cindyPulse { 0%, 100% { box-shadow: 0 4px 20px rgba(0,181,214,0.3); } 50% { box-shadow: 0 4px 20px rgba(0,181,214,0.6), 0 0 0 6px rgba(0,181,214,0.15); } }
        @keyframes cindyBreathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.02); } }
        @keyframes cindyBob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        @keyframes cindyGlow { 0%, 100% { box-shadow: 0 0 0 4px rgba(255,255,255,0.3); } 50% { box-shadow: 0 0 0 8px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.3); } }
        @keyframes cindyWave { 0%, 100% { height: 8px; } 50% { height: 20px; } }
      `}</style>
    </>
  )
}
