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

  const stateRef = useRef<State>('hidden')
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const messagesRef = useRef<{ role: string; text: string }[]>([])
  const activeRef = useRef(false)
  const processingRef = useRef(false) // Prevent double-processing
  const router = useRouter()
  const pathname = usePathname()
  const pathnameRef = useRef(pathname)

  useEffect(() => { stateRef.current = state }, [state])
  useEffect(() => { pathnameRef.current = pathname }, [pathname])

  // Greeting after 3s
  useEffect(() => {
    if (!sessionStorage.getItem('cindy-greeted')) {
      const t = setTimeout(() => { setShowPopup(true); setState('greeting') }, 3000)
      return () => clearTimeout(t)
    }
  }, [])

  // Blink
  useEffect(() => {
    const id = setInterval(() => { setBlinking(true); setTimeout(() => setBlinking(false), 150) }, 3500)
    return () => clearInterval(id)
  }, [])

  // Mouth during speech
  useEffect(() => {
    if (state !== 'speaking') { setMouthOpen(false); return }
    const id = setInterval(() => setMouthOpen(p => !p), 130)
    return () => clearInterval(id)
  }, [state])

  // ===== Navigate =====
  function doNavigate(route: string, scroll?: string) {
    if (pathnameRef.current !== route) {
      router.push(route)
      if (scroll) setTimeout(() => document.getElementById(scroll)?.scrollIntoView({ behavior: 'smooth' }), 1000)
    } else if (scroll) {
      document.getElementById(scroll)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // ===== Speak via ElevenLabs — NO background mic detection =====
  // Research: https://dev.to/remi_etien — "The microphone picks up the speaker
  // output. The agent hears itself and interrupts." The ONLY reliable fix is to
  // NOT run speech recognition while audio plays. User taps button to interrupt.
  async function speakText(text: string): Promise<void> {
    // Try ElevenLabs
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
        await new Promise<void>(resolve => {
          audio.onended = () => { URL.revokeObjectURL(url); audioRef.current = null; resolve() }
          audio.onerror = () => { URL.revokeObjectURL(url); audioRef.current = null; resolve() }
          audio.play().catch(() => { audioRef.current = null; resolve() })
        })
        return
      }
    } catch (e) {
      console.error('ElevenLabs TTS failed:', e)
    }

    // Fallback: browser TTS
    await new Promise<void>(resolve => {
      const u = new SpeechSynthesisUtterance(text)
      u.rate = 0.95
      u.pitch = 1.05
      const voices = speechSynthesis.getVoices()
      const v = voices.find(v => v.name.includes('Samantha') || v.name.includes('Google UK English Female'))
      if (v) u.voice = v
      u.onend = () => resolve()
      u.onerror = () => resolve()
      speechSynthesis.speak(u)
    })
  }

  // ===== Stop current audio (for manual interrupt) =====
  function interruptSpeech() {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.currentTime = 0; audioRef.current = null }
    speechSynthesis.cancel()
  }

  // ===== Process message → AI → Speak → Auto-restart =====
  async function processMessage(userText: string) {
    if (processingRef.current) return // Prevent double-fire
    processingRef.current = true
    setState('thinking')
    setTranscript('')

    messagesRef.current.push({ role: 'user', text: userText })

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messagesRef.current],
          voiceMode: true,
        }),
      })
      const data = await res.json()
      const aiText = data.text || "Sorry, could you say that again?"

      messagesRef.current.push({ role: 'bot', text: aiText })

      // Navigate immediately
      if (data.navigate) {
        doNavigate(data.navigate.route, data.navigate.scroll)
      }

      // Speak (no background mic — that caused the self-interrupt bug)
      setState('speaking')
      setResponse(aiText)
      await speakText(aiText)

      // After speaking completes naturally → auto-restart listening
      processingRef.current = false
      if (activeRef.current && stateRef.current === 'speaking') {
        setState('idle')
        // Small delay so browser mic doesn't pick up tail-end of audio
        setTimeout(() => {
          if (activeRef.current && stateRef.current === 'idle') {
            startListening()
          }
        }, 600)
      } else {
        setState('idle')
      }
    } catch {
      processingRef.current = false
      setState('idle')
      setResponse("Having trouble connecting. Try again.")
    }
  }

  // ===== Start listening =====
  function startListening() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return
    if (stateRef.current === 'listening' || stateRef.current === 'thinking' || stateRef.current === 'speaking') return

    // Make sure no audio is playing
    interruptSpeech()

    setState('listening')
    setTranscript('')
    processingRef.current = false

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

      // Reset silence timer
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = setTimeout(() => {
        if (accumulated.trim() && !sent) {
          sent = true
          try { rec.stop() } catch {}
          recognitionRef.current = null
          processMessage(accumulated.trim())
        }
      }, 2000)
    }

    rec.onend = () => {
      if (!sent && stateRef.current === 'listening' && accumulated.trim()) {
        sent = true
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
        processMessage(accumulated.trim())
      } else if (!sent && stateRef.current === 'listening') {
        // No speech detected — restart if conversation active
        if (activeRef.current) {
          setTimeout(() => {
            if (activeRef.current && stateRef.current !== 'thinking' && stateRef.current !== 'speaking') {
              startListening()
            }
          }, 300)
        } else {
          setState('idle')
        }
      }
    }

    rec.onerror = (e: any) => {
      if (e.error === 'no-speech') {
        if (activeRef.current) {
          setTimeout(() => {
            if (activeRef.current && stateRef.current !== 'thinking' && stateRef.current !== 'speaking') {
              startListening()
            }
          }, 300)
        } else {
          setState('idle')
        }
      } else if (e.error !== 'aborted') {
        console.error('Speech error:', e.error)
        setState('idle')
      }
    }

    recognitionRef.current = rec
    rec.start()
  }

  function stopEverything() {
    activeRef.current = false
    processingRef.current = false
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)
    try { recognitionRef.current?.stop() } catch {}
    recognitionRef.current = null
    interruptSpeech()
    setState('idle')
  }

  // Button handler — context-aware
  function handleMicButton() {
    if (state === 'speaking') {
      // Interrupt speech → start listening
      interruptSpeech()
      setState('idle')
      activeRef.current = true
      setTimeout(() => startListening(), 300)
    } else if (state === 'listening') {
      stopEverything()
    } else {
      activeRef.current = true
      startListening()
    }
  }

  function acceptGreeting() {
    sessionStorage.setItem('cindy-greeted', 'true')
    activeRef.current = true
    ;(async () => {
      setState('speaking')
      setResponse("Hey! I'm Cindy, your AI guide. Ask me anything or tell me where to go!")
      await speakText("Hey! I'm Cindy, your AI guide. Ask me anything or tell me where to go!")
      setState('idle')
      if (activeRef.current) setTimeout(() => startListening(), 500)
    })()
  }

  function dismissCindy() {
    sessionStorage.setItem('cindy-greeted', 'true')
    stopEverything()
    setDismissed(true)
    setShowPopup(false)
    setState('hidden')
  }

  const showMini = dismissed || state === 'hidden'
  if (!showPopup && !dismissed && state === 'hidden') return null

  // Button label + color
  const btnLabel = state === 'listening' ? 'Tap to Stop' : state === 'speaking' ? 'Tap to Interrupt' : 'Tap to Talk'
  const btnColor = state === 'listening' ? '#ff4444' : state === 'speaking' ? '#E67E22' : '#00B5D6'

  return (
    <>
      {showMini && (
        <button onClick={() => { setDismissed(false); setShowPopup(true); setState('idle'); activeRef.current = true }} aria-label="Talk to Cindy" style={{ position: 'fixed', bottom: 110, right: 28, zIndex: 9998, width: 56, height: 56, borderRadius: '50%', border: '3px solid #00B5D6', overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'white', boxShadow: '0 4px 20px rgba(0,181,214,0.3)', animation: 'cindyPulse 2s ease-in-out infinite' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cindy.png" alt="Cindy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </button>
      )}

      {showPopup && !dismissed && (
        <div style={{ position: 'fixed', bottom: 110, right: 28, zIndex: 9998, width: 320, borderRadius: 20, overflow: 'hidden', background: 'white', border: '2px solid #00B5D6', boxShadow: '0 20px 60px rgba(0,181,214,0.25)', animation: 'cindySlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <button onClick={dismissCindy} style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', fontSize: 14 }}>✕</button>

          <div style={{ background: 'linear-gradient(135deg, #00B5D6 0%, #0090A8 100%)', padding: '24px 24px 32px', textAlign: 'center' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', margin: '0 auto 12px', border: '3px solid white', overflow: 'hidden', position: 'relative', boxShadow: state === 'listening' ? '0 0 0 4px rgba(255,255,255,0.4), 0 0 20px rgba(255,255,255,0.3)' : '0 4px 16px rgba(0,0,0,0.2)', animation: state === 'speaking' ? 'cindyBob 0.4s ease-in-out infinite' : state === 'listening' ? 'cindyGlow 1.5s ease-in-out infinite' : 'cindyBreathe 3s ease-in-out infinite' }}>
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

          <div style={{ padding: '20px 24px', minHeight: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {state === 'greeting' ? (
              <>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: '#333', margin: '0 0 16px' }}>Hi! I&apos;m <strong style={{ color: '#00B5D6' }}>Cindy</strong>, your AI voice guide. I can navigate this website, answer questions, and show you around. Want to try?</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={acceptGreeting} style={{ flex: 1, background: '#00B5D6', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Talk to Cindy</button>
                  <button onClick={dismissCindy} style={{ padding: '12px 16px', background: '#f0f0f0', color: '#666', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer' }}>Later</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 13, lineHeight: 1.6, color: '#555', marginBottom: 16, textAlign: 'center', minHeight: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {state === 'listening' && transcript ? <p style={{ color: '#00B5D6', fontStyle: 'italic', margin: 0 }}>&ldquo;{transcript}&rdquo;</p>
                  : state === 'listening' ? <p style={{ margin: 0, color: '#00B5D6' }}>Listening...</p>
                  : state === 'thinking' ? <div style={{ display: 'flex', gap: 4 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00B5D6', animation: 'dotBounce 1.4s infinite' }} /><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00B5D6', animation: 'dotBounce 1.4s infinite', animationDelay: '0.2s' }} /><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00B5D6', animation: 'dotBounce 1.4s infinite', animationDelay: '0.4s' }} /></div>
                  : (state === 'speaking' || state === 'idle') && response ? <p style={{ margin: 0, fontSize: 12, color: '#888', maxHeight: 60, overflow: 'hidden' }}>{response.substring(0, 150)}{response.length > 150 ? '...' : ''}</p>
                  : <p style={{ margin: 0, color: '#999' }}>Tap the mic to start talking</p>}
                </div>
                <button
                  onClick={handleMicButton}
                  disabled={state === 'thinking'}
                  style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', cursor: state === 'thinking' ? 'wait' : 'pointer', background: btnColor, color: 'white', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.3s ease' }}>
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" /></svg>
                  {btnLabel}
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
        @keyframes cindyGlow { 0%, 100% { box-shadow: 0 0 0 4px rgba(255,255,255,0.3); } 50% { box-shadow: 0 0 0 8px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.4); } }
        @keyframes cindyWave { 0%, 100% { height: 8px; } 50% { height: 20px; } }
        @keyframes dotBounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
      `}</style>
    </>
  )
}
