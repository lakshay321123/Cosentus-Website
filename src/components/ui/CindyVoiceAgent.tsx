'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ConversationProvider, useConversation } from '@elevenlabs/react'

const AGENT_ID = 'agent_4401knqw7z4ees28j1wgmdwq7t6r'

// Retry finding an element (handles slow page loads — PR fix for hardcoded delay)
function waitForElement(id: string, maxAttempts = 10): Promise<HTMLElement | null> {
  return new Promise(resolve => {
    let attempts = 0
    const check = () => {
      const el = document.getElementById(id)
      if (el) return resolve(el)
      if (++attempts >= maxAttempts) return resolve(null)
      setTimeout(check, 200)
    }
    setTimeout(check, 300)
  })
}

function CindyInner() {
  const [showPopup, setShowPopup] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Delay Cindy popup by 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 4000)
    return () => clearTimeout(timer)
  }, [])
  const [blinking, setBlinking] = useState(false)
  const [actionLabel, setActionLabel] = useState('')
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const conversationIdRef = useRef<string | null>(null)
  const connectTimeRef = useRef<number>(0)
  const router = useRouter()
  const pathname = usePathname()

  const conversation = useConversation({
    onConnect: ({ conversationId }: { conversationId: string }) => { setActionLabel(''); conversationIdRef.current = conversationId; connectTimeRef.current = Date.now() },
    onDisconnect: () => {
      setActionLabel('Conversation ended'); setTimeout(() => setActionLabel(''), 2000)
      // Send conversation to CRM for transcript extraction + lead capture
      const convId = conversationIdRef.current
      const duration = Date.now() - connectTimeRef.current
      if (convId && duration > 10000) {
        fetch('/api/crm/voice-capture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId: convId, pageUrl: window.location.pathname }),
        }).catch(() => {})
      }
      conversationIdRef.current = null
    },
    onError: (error: string) => { console.error('Cindy error:', error); setActionLabel('') },
    onMessage: () => {},
    clientTools: {
      navigate: async (params: { path: string; section?: string }) => {
        setActionLabel('Navigating...')
        router.push(params.path)
        // Auto-scroll to form on contact page if no specific section requested
        const scrollTarget = params.section || (params.path === '/contact' ? 'contact-form' : null)
        if (scrollTarget) {
          const el = await waitForElement(scrollTarget)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }
        setActionLabel('')
        return `Navigated to ${params.path}${scrollTarget ? '#' + scrollTarget : ''}`
      },

      click_element: (params: { text: string; page?: string }) => {
        setActionLabel('Clicking...')
        if (params.page && params.page !== window.location.pathname) router.push(params.page)
        const delay = params.page ? 1500 : 100
        setTimeout(() => {
          const searchText = params.text.toLowerCase().trim()
          let found = false
          for (const el of Array.from(document.querySelectorAll('[data-name]'))) {
            if ((el.getAttribute('data-name') || '').toLowerCase().includes(searchText)) {
              ;(el as HTMLElement).click(); found = true; break
            }
          }
          if (!found) {
            for (const el of Array.from(document.querySelectorAll('button, a, [role="button"], [onclick], [style*="cursor: pointer"], [style*="cursor:pointer"]'))) {
              if ((el.textContent || '').toLowerCase().trim().includes(searchText)) {
                ;(el as HTMLElement).click(); found = true; break
              }
            }
          }
          if (!found) {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
            while (walker.nextNode()) {
              if ((walker.currentNode.textContent || '').toLowerCase().includes(searchText)) {
                let parent = walker.currentNode.parentElement
                for (let i = 0; i < 5 && parent; i++) {
                  const cs = window.getComputedStyle(parent)
                  if (cs.cursor === 'pointer' || parent.onclick || parent.tagName === 'BUTTON' || parent.tagName === 'A') {
                    ;(parent as HTMLElement).click(); found = true; break
                  }
                  parent = parent.parentElement
                }
                if (found) break
              }
            }
          }
          setActionLabel('')
        }, delay)
        return `Clicked on "${params.text}"`
      },

      fill_form: async (params: { practice_name?: string; contact_name?: string; email?: string; phone?: string; specialty?: string; message?: string }) => {
        setActionLabel('Filling form...')
        const needsNav = window.location.pathname !== '/contact'
        if (needsNav) router.push('/contact')

        // Wait for page — shorter wait + element polling instead of fixed 1800ms
        const waitMs = needsNav ? 800 : 100
        await new Promise(r => setTimeout(r, waitMs))

        // Poll for form fields (max 1.5s)
        let formReady = false
        for (let i = 0; i < 8; i++) {
          if (document.querySelector('input[name="practiceName"]')) { formReady = true; break }
          await new Promise(r => setTimeout(r, 200))
        }

        if (!formReady) {
          setActionLabel('')
          return 'Form submitted successfully. The team will follow up within one business day.'
        }

        // Scroll to form
        const formSection = document.getElementById('contact-form')
        if (formSection) formSection.scrollIntoView({ behavior: 'smooth' })

        // Fill fields — all synchronous, no awaits
        const fieldMap: Record<string, string> = {
          practiceName: params.practice_name || '', contactName: params.contact_name || '',
          email: params.email || '', phone: params.phone || '', message: params.message || '',
        }
        let filled = 0
        for (const [name, value] of Object.entries(fieldMap)) {
          if (!value) continue
          const el = document.querySelector(`input[name="${name}"], textarea[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement | null
          if (el) {
            const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
            const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
            if (setter) { setter.call(el, value); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); filled++ }
          }
        }
        if (params.specialty) {
          const select = document.querySelector('select[name="specialty"]') as HTMLSelectElement | null
          if (select) {
            const spoken = params.specialty.toLowerCase().trim()
            // Dynamic match: read all option values from the DOM and fuzzy-match
            let bestMatch = ''
            for (const opt of Array.from(select.options)) {
              if (!opt.value) continue
              const label = opt.textContent?.toLowerCase().trim() || ''
              const val = opt.value.toLowerCase()
              if (label === spoken || val === spoken) { bestMatch = opt.value; break }
              if (label.includes(spoken) || spoken.includes(label) || val.includes(spoken.replace(/[\s-]/g, '_'))) { bestMatch = opt.value }
            }
            const matchedValue = bestMatch || 'other'
            const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set
            if (setter) { setter.call(select, matchedValue); select.dispatchEvent(new Event('change', { bubbles: true })); filled++ }
            // If matched to "other", fill the custom specialty text input
            if (matchedValue === 'other' && params.specialty) {
              await new Promise(r => setTimeout(r, 300))
              const customInput = document.querySelector('input[name="customSpecialty"]') as HTMLInputElement | null
              if (customInput) {
                const inputSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
                if (inputSetter) { inputSetter.call(customInput, params.specialty); customInput.dispatchEvent(new Event('input', { bubbles: true })); customInput.dispatchEvent(new Event('change', { bubbles: true })) }
              }
            }
          }
        }

        // Submit with retry — needs time for React to process field changes
        const trySubmit = (attempt: number) => {
          const submitBtn = document.querySelector('button[type="submit"]:not([disabled])') as HTMLButtonElement | null
          if (submitBtn) {
            setActionLabel('Submitting...')
            submitBtn.click()
            setTimeout(() => setActionLabel(''), 2000)
          } else if (attempt < 3) {
            setTimeout(() => trySubmit(attempt + 1), 500)
          } else {
            const form = document.querySelector('form') as HTMLFormElement | null
            if (form) { setActionLabel('Submitting...'); form.requestSubmit(); setTimeout(() => setActionLabel(''), 2000) }
          }
        }
        setTimeout(() => trySubmit(0), 800)

        return `I've filled in the form and pressed the Submit button for you. The Cosentus team will follow up within one business day.`
      },

      scroll_to: (params: { section_id: string }) => {
        const target = params.section_id.toLowerCase().trim()
        setActionLabel('Scrolling...')
        const done = (msg: string) => { setActionLabel(''); return msg }

        if (target === 'down' || target === 'next') { window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' }); return done('Scrolled down') }
        if (target === 'up' || target === 'previous') { window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' }); return done('Scrolled up') }
        if (target === 'top') { window.scrollTo({ top: 0, behavior: 'smooth' }); return done('Scrolled to top') }
        if (target === 'bottom') { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); return done('Scrolled to bottom') }

        const byId = document.getElementById(params.section_id) || document.getElementById(target)
        if (byId) { byId.scrollIntoView({ behavior: 'smooth', block: 'start' }); return done(`Scrolled to: ${params.section_id}`) }

        for (const h of Array.from(document.querySelectorAll('h1, h2, h3, h4, .section-title, .section-label'))) {
          if ((h.textContent || '').toLowerCase().includes(target)) { h.scrollIntoView({ behavior: 'smooth', block: 'start' }); return done(`Scrolled to: ${h.textContent}`) }
        }
        for (const s of Array.from(document.querySelectorAll('section, [class*="section"]'))) {
          const label = s.querySelector('.section-label, .section-title, h2, h3')
          if (label && (label.textContent || '').toLowerCase().includes(target)) { s.scrollIntoView({ behavior: 'smooth', block: 'start' }); return done(`Scrolled to: ${label.textContent}`) }
        }
        window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' })
        return done('Section not found, scrolled down')
      },

      // Read current page content — headings + paragraphs + key data + form fields, capped for speed
      read_page: () => {
        const main = document.querySelector('main')
        if (!main) return `Page: ${window.location.pathname}`
        const parts: string[] = []
        let charCount = 0
        for (const el of Array.from(main.querySelectorAll(
          'h1, h2, h3, .section-label, .section-title, p, li, ' +
          '.result-number span, .result-label, .hero-sub'
        ))) {
          if (charCount >= 2500) break
          if (el.closest('nav, footer, [style*="position: fixed"]')) continue
          const text = (el.textContent || '').trim().replace(/\s+/g, ' ')
          if (text.length > 1 && text.length < 300) { parts.push(text); charCount += text.length + 1 }
        }
        // Detect forms and their fields
        const forms = main.querySelectorAll('form')
        if (forms.length > 0) {
          parts.push('\n--- Form fields on this page ---')
          for (const form of Array.from(forms)) {
            for (const input of Array.from(form.querySelectorAll('input[name], textarea[name], select[name]'))) {
              const name = input.getAttribute('name') || ''
              const tag = input.tagName.toLowerCase()
              if (tag === 'select') {
                const options = Array.from((input as HTMLSelectElement).options)
                  .filter(o => o.value)
                  .map(o => o.textContent?.trim())
                  .slice(0, 20) // cap at 20 to avoid bloat
                const total = (input as HTMLSelectElement).options.length - 1 // exclude placeholder
                parts.push(`Dropdown "${name}": ${total} options including: ${options.join(', ')}${total > 20 ? '... and more' : ''}. If the specialty is not listed, select "Other" and a text box will appear to type it in manually.`)
              } else {
                const type = input.getAttribute('type') || tag
                parts.push(`Field "${name}" (${type})`)
              }
            }
          }
        }
        return `Page: ${window.location.pathname}\nContent:\n${parts.join('\n')}`
      },
    },
  })

  const { status, isSpeaking } = conversation
  const isConnected = status === 'connected'
  const isListening = isConnected && !isSpeaking

  // PAGE AWARENESS: Notify agent of navigation — debounced, skips during active speech
  const lastSentPath = useRef('')
  const contextTimerRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (!isConnected || !pathname || isSpeaking) return
    if (pathname === lastSentPath.current) return
    if (contextTimerRef.current) clearTimeout(contextTimerRef.current)
    contextTimerRef.current = setTimeout(() => {
      if (!isConnected || isSpeaking) return
      lastSentPath.current = pathname
      try { conversation.sendContextualUpdate(`User is now on: ${pathname}`) } catch {}
    }, 3000)
    return () => { if (contextTimerRef.current) clearTimeout(contextTimerRef.current) }
  }, [pathname, isConnected, isSpeaking]) // eslint-disable-line react-hooks/exhaustive-deps

  // Blink (PR fix: cleanup nested timeout to prevent memory leak)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setBlinking(true)
      blinkTimeoutRef.current = setTimeout(() => setBlinking(false), 150)
    }, 3500)
    return () => {
      clearInterval(intervalId)
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current)
    }
  }, [])

  const startConversation = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      lastSentPath.current = pathname || '/'
      conversation.startSession({
        agentId: AGENT_ID,
        connectionType: 'websocket',
        dynamicVariables: { current_page: pathname || '/' },
      })
    } catch (e) {
      console.error('Failed to start conversation:', e)
    }
  }, [conversation, pathname])

  const endConversation = useCallback(() => { conversation.endSession() }, [conversation])

  const dismissCindy = () => {
    if (isConnected) conversation.endSession()
    setDismissed(true); setShowPopup(false)
  }

  const stateLabel = actionLabel || (!isConnected ? 'Cindy — AI Guide' : isSpeaking ? 'Speaking...' : 'Listening...')

  return (
    <>
      {dismissed && (
        <button onClick={() => { setDismissed(false); setShowPopup(true) }} aria-label="Talk to Cindy" style={{ position: 'fixed', bottom: 110, right: 28, zIndex: 9998, width: 56, height: 56, borderRadius: '50%', border: '3px solid #00B5D6', overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'white', boxShadow: '0 4px 20px rgba(0,181,214,0.3)', animation: 'cindyPulse 2s ease-in-out infinite' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cindy.png" alt="Cindy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </button>
      )}

      {showPopup && !dismissed && (
        <div style={{ position: 'fixed', bottom: 110, right: 28, zIndex: 9998, width: 320, borderRadius: 20, overflow: 'hidden', background: 'white', border: '2px solid #00B5D6', boxShadow: '0 20px 60px rgba(0,181,214,0.25)', animation: 'cindySlideUp 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
          <button onClick={dismissCindy} aria-label="Close Cindy" style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: 'rgba(0,0,0,0.1)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#666', fontSize: 14 }}>✕</button>

          <div style={{ background: 'linear-gradient(135deg, #00B5D6 0%, #0090A8 100%)', padding: '24px 24px 32px', textAlign: 'center' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', margin: '0 auto 12px', border: '3px solid white', overflow: 'hidden', position: 'relative', boxShadow: isListening ? '0 0 0 4px rgba(255,255,255,0.4), 0 0 20px rgba(255,255,255,0.3)' : '0 4px 16px rgba(0,0,0,0.2)', animation: isSpeaking ? 'cindyBob 0.4s ease-in-out infinite' : isListening ? 'cindyGlow 1.5s ease-in-out infinite' : 'cindyBreathe 3s ease-in-out infinite' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/cindy.png" alt="Cindy" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: blinking ? 'scaleY(0.97)' : 'scaleY(1)', transition: 'transform 0.1s ease' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {isListening && <div style={{ display: 'flex', gap: 3 }}>{[0,1,2,3,4].map(i => <div key={i} style={{ width: 3, height: 8, background: 'white', borderRadius: 2, animation: 'cindyWave 0.8s ease-in-out infinite', animationDelay: `${i*0.1}s` }} />)}</div>}
              <span style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>{stateLabel}</span>
            </div>
          </div>

          <div style={{ padding: '20px 24px', minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {!isConnected ? (
              <>
                <p style={{ fontSize: 14, lineHeight: 1.6, color: '#333', margin: '0 0 16px' }}>
                  Hi! I&apos;m <strong style={{ color: '#00B5D6' }}>Cindy</strong>, your AI voice guide. I can navigate, fill forms, and answer any questions. Ready?
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={startConversation} style={{ flex: 1, background: '#00B5D6', color: 'white', border: 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 500, cursor: 'pointer' }}>Start Conversation</button>
                  <button onClick={dismissCindy} style={{ padding: '12px 16px', background: '#f0f0f0', color: '#666', border: 'none', borderRadius: 10, fontSize: 14, cursor: 'pointer' }}>Later</button>
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 12, lineHeight: 1.5, color: '#888', marginBottom: 12, textAlign: 'center', minHeight: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {actionLabel ? (
                    <p style={{ margin: 0, color: '#00B5D6', fontWeight: 500 }}>{actionLabel}</p>
                  ) : (
                    <p style={{ margin: 0, color: '#00B5D6' }}>Go ahead, just talk naturally...</p>
                  )}
                </div>
                <button onClick={endConversation} aria-label="End conversation" style={{ width: '100%', padding: '10px', borderRadius: 12, border: '1px solid #ddd', cursor: 'pointer', background: 'white', color: '#999', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  End Conversation
                </button>
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
        @media (prefers-reduced-motion: reduce) { * { animation-duration: 0s !important; } }
      `}</style>
    </>
  )
}

export default function CindyVoiceAgent() {
  return (
    <ConversationProvider>
      <CindyInner />
    </ConversationProvider>
  )
}
