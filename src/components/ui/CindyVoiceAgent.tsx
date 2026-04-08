'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, usePathname } from 'next/navigation'

type CindyState = 'hidden' | 'greeting' | 'idle' | 'listening' | 'thinking' | 'speaking'

// Navigation map — maps keywords to routes and scroll targets
const NAV_MAP: Record<string, { route: string; scroll?: string }> = {
  'home': { route: '/' },
  'homepage': { route: '/' },
  'about': { route: '/about' },
  'about us': { route: '/about' },
  'leadership': { route: '/about', scroll: 'leadership' },
  'team': { route: '/about', scroll: 'leadership' },
  'offices': { route: '/about', scroll: 'offices' },
  'anesthesia': { route: '/specialties/anesthesia' },
  'accreda': { route: '/specialties/anesthesia' },
  'orthopedics': { route: '/specialties/orthopedics' },
  'orthopedic': { route: '/specialties/orthopedics' },
  'pain management': { route: '/specialties/pain-management' },
  'pain': { route: '/specialties/pain-management' },
  'asc': { route: '/specialties/asc' },
  'surgery center': { route: '/specialties/asc' },
  'behavioral health': { route: '/specialties/behavioral-health' },
  'behavioral': { route: '/specialties/behavioral-health' },
  'mental health': { route: '/specialties/behavioral-health' },
  'billing': { route: '/services/billing-coding' },
  'coding': { route: '/services/billing-coding' },
  'medical billing': { route: '/services/billing-coding' },
  'practice management': { route: '/services/practice-management' },
  'ehr': { route: '/services/ehr-technology' },
  'technology': { route: '/services/ehr-technology' },
  'medcloud': { route: '/services/ehr-technology' },
  'rcm': { route: '/services/rcm' },
  'revenue cycle': { route: '/services/rcm' },
  'comprehensive': { route: '/services/rcm' },
  'cosentus ai': { route: '/cosentus-ai' },
  'ai agents': { route: '/cosentus-ai' },
  'agents': { route: '/cosentus-ai' },
  'r+a': { route: '/cosentus-ai' },
  'real artificial': { route: '/cosentus-ai' },
  'resources': { route: '/resources' },
  'case studies': { route: '/resources' },
  'white papers': { route: '/resources' },
  'contact': { route: '/contact' },
  'contact us': { route: '/contact' },
  'careers': { route: '/careers' },
  'jobs': { route: '/careers' },
  'results': { route: '/', scroll: 'results' },
  'services': { route: '/', scroll: 'services' },
}

export default function CindyVoiceAgent() {
  const [state, setState] = useState<CindyState>('hidden')
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [mouthOpen, setMouthOpen] = useState(false)
  const [blinking, setBlinking] = useState(false)
  const [expression, setExpression] = useState<'neutral' | 'happy' | 'thinking'>('neutral')
  const recognitionRef = useRef<any>(null)
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null)
  const router = useRouter()
  const pathname = usePathname()
  const messagesRef = useRef<{ role: string; content: string }[]>([])

  // Show greeting popup after 3 seconds on first visit
  useEffect(() => {
    const seen = sessionStorage.getItem('cindy-greeted')
    if (!seen) {
      const timer = setTimeout(() => {
        setShowPopup(true)
        setState('greeting')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Blink animation loop
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlinking(true)
      setTimeout(() => setBlinking(false), 150)
    }, 3000 + Math.random() * 2000)
    return () => clearInterval(blinkInterval)
  }, [])

  // Mouth animation during speech
  useEffect(() => {
    if (state !== 'speaking') { setMouthOpen(false); return }
    const mouthInterval = setInterval(() => {
      setMouthOpen(prev => !prev)
    }, 120 + Math.random() * 80)
    return () => clearInterval(mouthInterval)
  }, [state])

  // Navigate to a page/section
  const navigate = useCallback((route: string, scrollTarget?: string) => {
    if (pathname !== route) {
      router.push(route)
      if (scrollTarget) {
        setTimeout(() => {
          document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 800)
      }
    } else if (scrollTarget) {
      document.getElementById(scrollTarget)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [pathname, router])

  // Extract navigation intent from AI response
  const extractNavigation = (text: string) => {
    const lower = text.toLowerCase()
    for (const [keyword, target] of Object.entries(NAV_MAP)) {
      if (lower.includes(keyword)) return target
    }
    return null
  }

  // Speak text aloud
  const speak = useCallback((text: string) => {
    setState('speaking')
    setExpression('happy')
    setResponse(text)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.1
    // Try to find a female voice
    const voices = speechSynthesis.getVoices()
    const female = voices.find(v => v.name.includes('Samantha') || v.name.includes('Karen') || v.name.includes('Moira') || v.name.includes('Female') || v.name.includes('Google UK English Female'))
    if (female) utterance.voice = female

    utterance.onend = () => {
      setState('idle')
      setExpression('neutral')
    }
    synthRef.current = utterance
    speechSynthesis.speak(utterance)
  }, [])

  // Send message to COSE AI and get response
  const sendToCoseAI = useCallback(async (userText: string) => {
    setState('thinking')
    setExpression('thinking')

    messagesRef.current.push({ role: 'user', content: userText })

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesRef.current }),
      })
      const data = await res.json()
      const aiText = data.reply || "Sorry, I didn't catch that. Could you try again?"

      messagesRef.current.push({ role: 'assistant', content: aiText })

      // Check for navigation intent in user message
      const navTarget = extractNavigation(userText)
      if (navTarget) {
        navigate(navTarget.route, navTarget.scroll)
      }

      speak(aiText)
    } catch {
      speak("I'm having trouble connecting right now. Please try again in a moment.")
    }
  }, [speak, navigate])

  // Start listening
  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      speak("Voice recognition isn't supported in your browser. Try Chrome for the best experience.")
      return
    }

    setState('listening')
    setExpression('neutral')
    setTranscript('')

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      let text = ''
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript
      }
      setTranscript(text)
    }

    recognition.onend = () => {
      if (transcript || recognitionRef.current?._lastTranscript) {
        const finalText = recognitionRef.current?._lastTranscript || transcript
        if (finalText.trim()) {
          sendToCoseAI(finalText.trim())
        } else {
          setState('idle')
        }
      } else {
        setState('idle')
      }
    }

    recognition.onerror = () => {
      setState('idle')
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [transcript, sendToCoseAI, speak])

  // Update last transcript for onend handler
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current._lastTranscript = transcript
    }
  }, [transcript])

  // Handle greeting accept
  const acceptGreeting = () => {
    sessionStorage.setItem('cindy-greeted', 'true')
    setState('idle')
    speak("Hey! I'm Cindy, your AI guide. Ask me anything or say where you'd like to go. I can navigate the entire website for you!")
  }

  // Dismiss Cindy
  const dismissCindy = () => {
    sessionStorage.setItem('cindy-greeted', 'true')
    setDismissed(true)
    setShowPopup(false)
    setState('hidden')
    speechSynthesis.cancel()
  }

  // Mini avatar button (when dismissed or idle)
  const showMiniAvatar = dismissed || state === 'hidden'

  if (!showPopup && !dismissed && state === 'hidden') return null

  return (
    <>
      {/* Mini floating avatar — click to reopen */}
      {showMiniAvatar && (
        <button
          onClick={() => { setDismissed(false); setShowPopup(true); setState('idle') }}
          aria-label="Talk to Cindy"
          style={{
            position: 'fixed', bottom: 100, right: 28, zIndex: 9998,
            width: 56, height: 56, borderRadius: '50%', border: '3px solid #00B5D6',
            overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'white',
            boxShadow: '0 4px 20px rgba(0,181,214,0.3)',
            animation: 'cindyPulse 2s ease-in-out infinite',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cindy.png" alt="Cindy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </button>
      )}

      {/* Main Cindy Panel */}
      {showPopup && !dismissed && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9998,
          width: 320, borderRadius: 20, overflow: 'hidden',
          background: 'white', border: '2px solid #00B5D6',
          boxShadow: '0 20px 60px rgba(0,181,214,0.25), 0 8px 32px rgba(0,0,0,0.1)',
          animation: 'cindySlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* Close button */}
          <button onClick={dismissCindy} style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', fontSize: 14 }}>✕</button>

          {/* Avatar section */}
          <div style={{ background: 'linear-gradient(135deg, #00B5D6 0%, #0090A8 100%)', padding: '24px 24px 32px', textAlign: 'center', position: 'relative' }}>
            {/* Animated avatar container */}
            <div style={{
              width: 100, height: 100, borderRadius: '50%', margin: '0 auto 12px',
              border: '3px solid white', overflow: 'hidden', position: 'relative',
              boxShadow: state === 'listening' ? '0 0 0 4px rgba(255,255,255,0.4), 0 0 20px rgba(255,255,255,0.3)' : '0 4px 16px rgba(0,0,0,0.2)',
              transition: 'box-shadow 0.3s ease',
              animation: state === 'speaking' ? 'cindyBob 0.4s ease-in-out infinite' : state === 'listening' ? 'cindyGlow 1.5s ease-in-out infinite' : 'cindyBreathe 3s ease-in-out infinite',
            }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/cindy.png" alt="Cindy" style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transform: blinking ? 'scaleY(0.97)' : 'scaleY(1)',
                transition: 'transform 0.1s ease',
              }} />

              {/* Mouth overlay for talking effect */}
              {state === 'speaking' && (
                <div style={{
                  position: 'absolute', bottom: '22%', left: '50%', transform: 'translateX(-50%)',
                  width: mouthOpen ? 14 : 10, height: mouthOpen ? 8 : 3,
                  background: 'rgba(180,80,80,0.7)', borderRadius: '50%',
                  transition: 'all 0.08s ease',
                }} />
              )}

              {/* Expression overlays */}
              {expression === 'happy' && (
                <div style={{ position: 'absolute', bottom: '28%', left: '50%', transform: 'translateX(-50%)', width: 16, height: 3, borderRadius: '0 0 8px 8px', borderBottom: '2px solid rgba(255,255,255,0.3)' }} />
              )}
            </div>

            {/* State indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {state === 'listening' && (
                <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  {[0, 1, 2, 3, 4].map(i => (
                    <div key={i} style={{ width: 3, background: 'white', borderRadius: 2, animation: `cindyWave 0.8s ease-in-out infinite`, animationDelay: `${i * 0.1}s` }} />
                  ))}
                </div>
              )}
              <span style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>
                {state === 'greeting' ? 'Hey there! 👋' : state === 'listening' ? 'Listening...' : state === 'thinking' ? 'Thinking...' : state === 'speaking' ? 'Cindy' : 'Cindy — AI Guide'}
              </span>
            </div>
          </div>

          {/* Content area */}
          <div style={{ padding: '20px 24px', minHeight: 120, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {state === 'greeting' ? (
              <>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: '#333', margin: '0 0 16px' }}>
                  Hi! I&apos;m <strong style={{ color: '#00B5D6' }}>Cindy</strong>, your AI guide. I can navigate this entire website with my voice. Want to try?
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={acceptGreeting} style={{ flex: 1, background: '#00B5D6', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Talk to Cindy</button>
                  <button onClick={dismissCindy} style={{ padding: '12px 16px', background: '#f0f0f0', color: '#666', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer' }}>Later</button>
                </div>
              </>
            ) : (
              <>
                {/* Response text */}
                <div style={{ fontSize: 13, lineHeight: 1.6, color: '#333', marginBottom: 16, minHeight: 48 }}>
                  {state === 'listening' && transcript && (
                    <p style={{ color: '#00B5D6', fontStyle: 'italic', margin: 0 }}>&ldquo;{transcript}&rdquo;</p>
                  )}
                  {state === 'thinking' && (
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00B5D6', animation: 'dotBounce 1.4s infinite', animationDelay: '0s' }} />
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00B5D6', animation: 'dotBounce 1.4s infinite', animationDelay: '0.2s' }} />
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#00B5D6', animation: 'dotBounce 1.4s infinite', animationDelay: '0.4s' }} />
                    </div>
                  )}
                  {(state === 'speaking' || state === 'idle') && response && (
                    <p style={{ margin: 0 }}>{response}</p>
                  )}
                  {state === 'idle' && !response && (
                    <p style={{ margin: 0, color: '#999' }}>Tap the mic and ask me anything, or tell me where to go.</p>
                  )}
                </div>

                {/* Mic button */}
                <button
                  onClick={() => { speechSynthesis.cancel(); startListening() }}
                  disabled={state === 'thinking'}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 12,
                    border: 'none', cursor: state === 'thinking' ? 'wait' : 'pointer',
                    background: state === 'listening' ? '#ff4444' : '#00B5D6',
                    color: 'white', fontSize: 14, fontWeight: 500,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                  </svg>
                  {state === 'listening' ? 'Listening... (tap to stop)' : 'Tap to Talk'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes cindySlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.9); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes cindyPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(0,181,214,0.3); }
          50% { box-shadow: 0 4px 20px rgba(0,181,214,0.6), 0 0 0 6px rgba(0,181,214,0.15); }
        }
        @keyframes cindyBreathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes cindyBob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes cindyGlow {
          0%, 100% { box-shadow: 0 0 0 4px rgba(255,255,255,0.3), 0 0 20px rgba(255,255,255,0.2); }
          50% { box-shadow: 0 0 0 8px rgba(255,255,255,0.5), 0 0 30px rgba(255,255,255,0.4); }
        }
        @keyframes cindyWave {
          0%, 100% { height: 8px; }
          50% { height: 20px; }
        }
      `}</style>
    </>
  )
}
