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
  const [showPopup, setShowPopup] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const [blinking, setBlinking] = useState(false)
  const [actionLabel, setActionLabel] = useState('')
  const blinkTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const conversation = useConversation({
    onConnect: () => {},
    onDisconnect: () => {},
    onError: (error: string) => console.error('Cindy error:', error),
    onMessage: () => {},
    clientTools: {
      navigate: async (params: { path: string; section?: string }) => {
        setActionLabel('Navigating...')
        router.push(params.path)
        if (params.section) {
          const el = await waitForElement(params.section)
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }
        setActionLabel('')
        return `Navigated to ${params.path}${params.section ? '#' + params.section : ''}`
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

      fill_form: (params: { practice_name?: string; contact_name?: string; email?: string; phone?: string; specialty?: string; message?: string }) => {
        setActionLabel('Filling form...')
        if (window.location.pathname !== '/contact') router.push('/contact')
        setTimeout(() => {
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
              const specialtyMap: Record<string, string> = {
                'anesthesia': 'anesthesia', 'orthopedics': 'orthopedics', 'orthopedic': 'orthopedics',
                'pain management': 'pain-management', 'pain': 'pain-management',
                'asc': 'asc', 'ambulatory surgery': 'asc', 'surgery center': 'asc',
                'behavioral health': 'behavioral-health', 'behavioral': 'behavioral-health', 'mental health': 'behavioral-health',
                'urgent care': 'urgent-care', 'urgent': 'urgent-care', 'other': 'other',
              }
              const key = params.specialty.toLowerCase()
              const val = specialtyMap[key] || Object.values(specialtyMap).find(v => v.includes(key)) || key
              const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set
              if (setter) { setter.call(select, val); select.dispatchEvent(new Event('change', { bubbles: true })); filled++ }
            }
          }
          setActionLabel('')
        }, window.location.pathname !== '/contact' ? 1500 : 200)
        return 'Filling contact form'
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
    },
  })

  const { status, isSpeaking } = conversation
  const isConnected = status === 'connected'
  const isListening = isConnected && !isSpeaking

  // REAL-TIME PAGE CONTENT: Scrape actual text from the page and send to Cindy
  useEffect(() => {
    if (!isConnected || !pathname) return

    // Wait for page to render before scraping
    const timer = setTimeout(() => {
      try {
        const main = document.querySelector('main')
        if (!main) return

        // Build structured content from the page
        const sections: string[] = []
        let currentSection = ''

        const els = main.querySelectorAll(
          'h1, h2, h3, h4, .section-label, .section-title, .section-desc, ' +
          'p, li, .hero-sub, .hero-case-title, .hero-case-tag, ' +
          '.advantage-card h4, .advantage-card p, .service-card h4, .service-card p, ' +
          '.result-number span, .result-label, ' +
          'label, option, a.service-link, a.hero-case-link'
        )

        for (const el of Array.from(els)) {
          const tag = el.tagName.toLowerCase()
          const cls = el.className || ''
          const text = (el.textContent || '').trim().replace(/\s+/g, ' ')
          if (!text || text.length < 2) continue

          // Skip nav/footer/cindy panel content
          if (el.closest('nav, footer, [style*="position: fixed"]')) continue

          if (tag === 'h1' || tag === 'h2' || cls.includes('section-title')) {
            if (currentSection) sections.push(currentSection)
            currentSection = `\n## ${text}\n`
          } else if (tag === 'h3' || tag === 'h4' || cls.includes('section-label')) {
            currentSection += `\n### ${text}\n`
          } else if (cls.includes('result-number')) {
            currentSection += `${text} `
          } else if (cls.includes('result-label')) {
            currentSection += `${text}\n`
          } else {
            currentSection += `${text}\n`
          }
        }
        if (currentSection) sections.push(currentSection)

        const pageContent = sections.join('').substring(0, 4000)

        conversation.sendContextualUpdate(
          `PAGE: ${pathname}\n` +
          `The user is viewing this page right now. Here is the ACTUAL content on screen:\n` +
          `---\n${pageContent}\n---\n` +
          `Use this content to answer questions. You can reference specific text, numbers, names, and sections that are on this page. ` +
          `When the user says "scroll down" or "show me more", use the scroll_to tool with section_id="down". ` +
          `You can also scroll to any heading or section you see in the content above.`
        )
      } catch { /* ignore errors during page transitions */ }
    }, 800) // Wait for render

    return () => clearTimeout(timer)
  }, [pathname, isConnected]) // eslint-disable-line react-hooks/exhaustive-deps

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
      conversation.startSession({ agentId: AGENT_ID, connectionType: 'websocket' })
    } catch (e) {
      console.error('Failed to start conversation:', e)
    }
  }, [conversation])

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
