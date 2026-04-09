'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ConversationProvider, useConversation } from '@elevenlabs/react'

const AGENT_ID = 'agent_4401knqw7z4ees28j1wgmdwq7t6r'

function CindyInner() {
  const [showPopup, setShowPopup] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const [blinking, setBlinking] = useState(false)
  const router = useRouter()

  const conversation = useConversation({
    onConnect: () => console.log('Cindy connected'),
    onDisconnect: () => console.log('Cindy disconnected'),
    onError: (error: string) => console.error('Cindy error:', error),
    onMessage: (msg: { source: string; message: string }) => {
      console.log('Message:', msg.source, msg.message)
    },
    clientTools: {
      // Navigate to a page
      navigate: (params: { path: string; section?: string }) => {
        console.log('Cindy navigating to:', params.path, params.section)
        router.push(params.path)
        if (params.section) {
          setTimeout(() => {
            document.getElementById(params.section!)?.scrollIntoView({ behavior: 'smooth' })
          }, 1000)
        }
        return `Navigated to ${params.path}${params.section ? '#' + params.section : ''}`
      },

      // Click an element by text content, name, or data attribute
      click_element: (params: { text: string; page?: string }) => {
        console.log('Cindy clicking:', params.text, 'on page:', params.page)

        // Navigate first if needed
        if (params.page && params.page !== window.location.pathname) {
          router.push(params.page)
        }

        const delay = params.page ? 1500 : 100
        setTimeout(() => {
          const searchText = params.text.toLowerCase().trim()
          let found = false

          // Strategy 1: Find by data-name attribute (most reliable)
          const dataNameEls = document.querySelectorAll('[data-name]')
          for (const el of Array.from(dataNameEls)) {
            if ((el.getAttribute('data-name') || '').toLowerCase().includes(searchText)) {
              ;(el as HTMLElement).click()
              found = true
              console.log('Clicked by data-name:', el)
              break
            }
          }

          // Strategy 2: Find clickable elements by text
          if (!found) {
            const clickable = document.querySelectorAll('button, a, [role="button"], [onclick], [style*="cursor: pointer"], [style*="cursor:pointer"]')
            for (const el of Array.from(clickable)) {
              const elText = (el.textContent || '').toLowerCase().trim()
              if (elText.includes(searchText) || searchText.includes(elText.substring(0, 10))) {
                ;(el as HTMLElement).click()
                found = true
                console.log('Clicked clickable element:', el)
                break
              }
            }
          }

          // Strategy 3: Find any element with text and walk UP to clickable parent
          if (!found) {
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
            while (walker.nextNode()) {
              const textNode = walker.currentNode
              if ((textNode.textContent || '').toLowerCase().includes(searchText)) {
                // Walk up to find clickable parent
                let parent = textNode.parentElement
                for (let i = 0; i < 5 && parent; i++) {
                  if (parent.style.cursor === 'pointer' || parent.onclick || parent.getAttribute('role') === 'button' || parent.tagName === 'BUTTON' || parent.tagName === 'A') {
                    ;(parent as HTMLElement).click()
                    found = true
                    console.log('Clicked parent of text node:', parent)
                    break
                  }
                  parent = parent.parentElement
                }
                if (found) break
              }
            }
          }

          if (!found) console.warn('Could not find element:', params.text)
        }, delay)

        return `Clicked on "${params.text}"`
      },

      // Fill out a form (Contact Us page)
      fill_form: (params: {
        practice_name?: string
        contact_name?: string
        email?: string
        phone?: string
        specialty?: string
        message?: string
      }) => {
        console.log('Cindy filling form:', params)

        // Navigate to contact page if not there
        if (window.location.pathname !== '/contact') {
          router.push('/contact')
        }

        setTimeout(() => {
          // Map params to actual React form field names
          const fieldMap: Record<string, string> = {
            practiceName: params.practice_name || '',
            contactName: params.contact_name || '',
            email: params.email || '',
            phone: params.phone || '',
            message: params.message || '',
          }

          let filled = 0

          // Fill text inputs and textarea
          for (const [name, value] of Object.entries(fieldMap)) {
            if (!value) continue
            const el = document.querySelector(`input[name="${name}"], textarea[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement | null
            if (el) {
              const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
              const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
              if (setter) {
                setter.call(el, value)
                el.dispatchEvent(new Event('input', { bubbles: true }))
                el.dispatchEvent(new Event('change', { bubbles: true }))
                filled++
              }
            }
          }

          // Handle specialty SELECT dropdown separately
          if (params.specialty) {
            const select = document.querySelector('select[name="specialty"]') as HTMLSelectElement | null
            if (select) {
              // Map spoken specialty to option value
              const specialtyMap: Record<string, string> = {
                'anesthesia': 'anesthesia',
                'orthopedics': 'orthopedics',
                'orthopedic': 'orthopedics',
                'pain management': 'pain-management',
                'pain': 'pain-management',
                'asc': 'asc',
                'ambulatory surgery': 'asc',
                'surgery center': 'asc',
                'behavioral health': 'behavioral-health',
                'behavioral': 'behavioral-health',
                'mental health': 'behavioral-health',
                'urgent care': 'urgent-care',
                'urgent': 'urgent-care',
                'other': 'other',
              }
              const key = params.specialty.toLowerCase()
              const optionValue = specialtyMap[key] || Object.values(specialtyMap).find(v => v.includes(key)) || params.specialty.toLowerCase()

              const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set
              if (setter) {
                setter.call(select, optionValue)
                select.dispatchEvent(new Event('change', { bubbles: true }))
                filled++
              }
            }
          }

          console.log(`Filled ${filled} form fields`)
        }, window.location.pathname !== '/contact' ? 1500 : 200)

        return `Filling contact form with provided details`
      },

      // Scroll to a specific section on the current page
      scroll_to: (params: { section_id: string }) => {
        console.log('Cindy scrolling to:', params.section_id)
        const el = document.getElementById(params.section_id)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
          return `Scrolled to section: ${params.section_id}`
        }
        return `Section "${params.section_id}" not found on this page`
      },
    },
  })

  const { status, isSpeaking } = conversation
  const isConnected = status === 'connected'
  const isListening = isConnected && !isSpeaking

  // Blink
  useEffect(() => {
    const id = setInterval(() => { setBlinking(true); setTimeout(() => setBlinking(false), 150) }, 3500)
    return () => clearInterval(id)
  }, [])

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
    startConversation()
  }

  const dismissCindy = () => {
    if (isConnected) conversation.endSession()
    setDismissed(true)
    setShowPopup(false)
  }

  const stateLabel = !isConnected ? 'Cindy — AI Guide' : isSpeaking ? 'Speaking...' : 'Listening...'

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
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              {isListening && <div style={{ display: 'flex', gap: 3 }}>{[0,1,2,3,4].map(i => <div key={i} style={{ width: 3, background: 'white', borderRadius: 2, animation: 'cindyWave 0.8s ease-in-out infinite', animationDelay: `${i*0.1}s` }} />)}</div>}
              <span style={{ fontSize: 13, color: 'white', fontWeight: 500 }}>{stateLabel}</span>
            </div>
          </div>

          <div style={{ padding: '20px 24px', minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            {!isConnected ? (
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
