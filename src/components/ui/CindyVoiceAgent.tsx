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

  // Persisted dismissal — respects user's choice across refreshes + 24h across sessions.
  // Key stores epoch ms of expiry. If now < expiry, stay dismissed.
  const DISMISS_KEY = 'cindy-dismissed-until'
  const DISMISS_TTL_MS = 24 * 60 * 60 * 1000 // 24h

  // Delay Cindy popup by 4 seconds — but skip entirely if recently dismissed.
  useEffect(() => {
    let dismissedUntil = 0
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(DISMISS_KEY) : null
      if (raw) dismissedUntil = parseInt(raw, 10) || 0
    } catch { /* localStorage blocked — fall through to default behavior */ }
    if (dismissedUntil > Date.now()) { setDismissed(true); return }
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
    onConnect: ({ conversationId }: { conversationId: string }) => {
      setActionLabel(''); conversationIdRef.current = conversationId; connectTimeRef.current = Date.now()
      try { window.sessionStorage.setItem('cindy-conversation-id', conversationId) } catch {}
    },
    onDisconnect: () => {
      setActionLabel('Conversation ended'); setTimeout(() => setActionLabel(''), 2000)
      try { window.sessionStorage.removeItem('cindy-conversation-id') } catch {}
      // Drop any pathname update that was queued while speaking — it refers
      // to the old session's context and would mislead a new session.
      pendingPathRef.current = null
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

      click_element: async (params: { text: string; page?: string }) => {
        setActionLabel('Clicking...')
        if (params.page && params.page !== window.location.pathname) {
          router.push(params.page)
          // Poll for URL update (fast path) up to 1.2s.
          for (let i = 0; i < 12; i++) {
            if (window.location.pathname === params.page) break
            await new Promise(r => setTimeout(r, 100))
          }
          // Paint buffer — URL updating doesn't mean the page's DOM is ready.
          // 400ms gives React time to hydrate the new route before we try to click.
          await new Promise(r => setTimeout(r, 400))
        } else {
          await new Promise(r => setTimeout(r, 50))
        }

        const searchText = params.text.toLowerCase().trim()
        // Ranked candidates — higher rank wins. 0 = unusable.
        type Candidate = { el: HTMLElement; rank: number }
        let best: Candidate | null = null
        // Gate before ranking: exclude hidden, disabled, or non-interactive elements.
        // Without this, mobile drawer clones, pointer-events:none decorative elements,
        // and disabled buttons all rank as candidates and we claim "Clicked X" when
        // nothing actually happens.
        const isClickable = (el: HTMLElement): boolean => {
          if (el.hasAttribute('hidden')) return false
          if (el.getAttribute('aria-hidden') === 'true') return false
          if (el.getAttribute('aria-disabled') === 'true') return false
          if ((el as HTMLButtonElement).disabled === true) return false
          // offsetParent is null when element or any ancestor is display:none
          // (doesn't catch visibility:hidden, computed style below handles that)
          if (el.offsetParent === null && window.getComputedStyle(el).position !== 'fixed') return false
          const cs = window.getComputedStyle(el)
          if (cs.visibility === 'hidden' || cs.display === 'none') return false
          if (cs.pointerEvents === 'none') return false
          return true
        }

        const consider = (el: HTMLElement, rank: number) => {
          if (!isClickable(el)) return
          if (!best || rank > best.rank) best = { el, rank }
        }

        // Pass 1 — data-name attribute (exact and startsWith beat contains)
        for (const el of Array.from(document.querySelectorAll<HTMLElement>('[data-name]'))) {
          const dn = (el.getAttribute('data-name') || '').toLowerCase()
          if (!dn) continue
          if (dn === searchText) consider(el, 100)
          else if (dn.startsWith(searchText)) consider(el, 80)
          else if (dn.includes(searchText)) consider(el, 60)
        }
        // Pass 2 — interactive elements by visible text
        for (const el of Array.from(document.querySelectorAll<HTMLElement>('button, a, [role="button"], [onclick]'))) {
          const text = (el.textContent || '').toLowerCase().trim()
          if (!text) continue
          if (text === searchText) consider(el, 90)
          else if (text.startsWith(searchText)) consider(el, 70)
          else if (text.includes(searchText)) consider(el, 50)
        }
        // Pass 3 — cursor:pointer fallback
        if (!best || (best as Candidate).rank < 50) {
          for (const el of Array.from(document.querySelectorAll<HTMLElement>('[style*="cursor: pointer"], [style*="cursor:pointer"]'))) {
            const text = (el.textContent || '').toLowerCase().trim()
            if (text && text.includes(searchText)) consider(el, 40)
          }
        }
        // Pass 4 — text walker as last resort, walk up to find a clickable ancestor
        if (!best) {
          const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
          while (walker.nextNode()) {
            const node = walker.currentNode
            if (!(node.textContent || '').toLowerCase().includes(searchText)) continue
            let parent = node.parentElement
            for (let i = 0; i < 5 && parent; i++) {
              const cs = window.getComputedStyle(parent)
              if (cs.cursor === 'pointer' || (parent as HTMLElement).onclick || parent.tagName === 'BUTTON' || parent.tagName === 'A') {
                consider(parent as HTMLElement, 20); break
              }
              parent = parent.parentElement
            }
            if (best) break
          }
        }

        setActionLabel('')
        if (best) {
          ;(best as Candidate).el.click()
          return `Clicked "${params.text}"`
        }
        return `Couldn\'t find anything matching "${params.text}" on this page.`
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
          // Truthful failure — form didn't load. Give agent a workable path
          // instead of falsely claiming success. Phone matches site-wide CTA.
          return 'I couldn\'t reach the contact form — you can call the team directly at (877) 806-2286 or I can try again.'
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
            // Normalize both sides symmetrically (space/hyphen -> underscore) so
            // "pain management" <-> "pain_management" matches in either direction.
            const normalize = (s: string) => s.replace(/[\s-]+/g, '_')
            const nSpoken = normalize(spoken)
            // Ranked match: exact > startsWith > contains. Break on exact.
            let bestMatch = ''
            let bestRank = 0 // 0=none, 1=contains, 2=startsWith, 3=exact
            for (const opt of Array.from(select.options)) {
              if (!opt.value) continue
              const label = (opt.textContent || '').toLowerCase().trim()
              const val = opt.value.toLowerCase()
              const nVal = normalize(val)
              const nLabel = normalize(label)
              let rank = 0
              if (label === spoken || val === spoken || nVal === nSpoken || nLabel === nSpoken) rank = 3
              else if (label.startsWith(spoken) || val.startsWith(spoken) || nLabel.startsWith(nSpoken) || nVal.startsWith(nSpoken)) rank = 2
              else if (
                label.includes(spoken) || val.includes(spoken) ||
                nLabel.includes(nSpoken) || nVal.includes(nSpoken) ||
                spoken.includes(label) || nSpoken.includes(nLabel)
              ) rank = 1
              if (rank > bestRank) { bestMatch = opt.value; bestRank = rank; if (rank === 3) break }
            }
            const matchedValue = bestMatch || 'other'
            const setter = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value')?.set
            if (setter) { setter.call(select, matchedValue); select.dispatchEvent(new Event('change', { bubbles: true })); filled++ }
            // If matched to "other" (or no match), fill the customSpecialty text input.
            // This field only exists in ContactContent and is conditionally rendered
            // when "Other" is selected, so we poll for it instead of relying on a
            // fixed delay. Null check at the end prevents errors on other forms.
            if (matchedValue === 'other') {
              let customInput: HTMLInputElement | null = null
              for (let i = 0; i < 5 && !customInput; i++) {
                if (i > 0) await new Promise(r => setTimeout(r, 100))
                customInput = document.querySelector('input[name="customSpecialty"]') as HTMLInputElement | null
              }
              if (customInput) {
                const inputSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
                if (inputSetter) { inputSetter.call(customInput, params.specialty); customInput.dispatchEvent(new Event('input', { bubbles: true })); customInput.dispatchEvent(new Event('change', { bubbles: true })) }
              }
            }
          }
        }

        // Bounded submit + truthful confirmation.
        // Constraint: must return within ~2s to avoid ElevenLabs tool-call timeout,
        // so we race submission against a short watcher instead of waiting forever.
        // We also have to detect success from the DOM because the submit is fire-and-forget
        // from this function's perspective (React handles the POST, we observe the result).

        // Step 1 — try to actually click submit, up to 3 retries. Returns true if we
        // clicked a button or called requestSubmit; false if no submit path was ever found.
        const attemptSubmit = async (): Promise<boolean> => {
          for (let attempt = 0; attempt < 3; attempt++) {
            if (attempt > 0) await new Promise(r => setTimeout(r, 300))
            const submitBtn = document.querySelector('button[type="submit"]:not([disabled])') as HTMLButtonElement | null
            if (submitBtn) { setActionLabel('Submitting...'); submitBtn.click(); return true }
          }
          // Last resort: requestSubmit bypasses visual button but still triggers React onSubmit
          const form = document.querySelector('form') as HTMLFormElement | null
          if (form) { setActionLabel('Submitting...'); form.requestSubmit(); return true }
          return false
        }

        // Step 2 — watch for success signal. ContactContent renders a "Thank you!" h3
        // once submitted successfully. We poll up to 1500ms.
        // We intentionally do NOT treat form-removal as success — a re-render,
        // route change, or unmount could also remove the form without it being
        // a successful submission. Only the explicit Thank-you heading confirms.
        const watchForSuccess = async (): Promise<boolean> => {
          for (let i = 0; i < 15; i++) { // 15 × 100ms = 1500ms
            await new Promise(r => setTimeout(r, 100))
            const thankYou = Array.from(document.querySelectorAll('h3')).some(h => (h.textContent || '').includes('Thank you'))
            if (thankYou) return true
          }
          return false
        }

        // Give React a beat to process field changes before we click submit.
        await new Promise(r => setTimeout(r, 400))

        // Build a recap of what was filled so Cindy can read it back.
        const filledSummary: string[] = []
        if (params.practice_name) filledSummary.push(`practice name as ${params.practice_name}`)
        if (params.contact_name) filledSummary.push(`contact as ${params.contact_name}`)
        if (params.email) filledSummary.push(`email as ${params.email}`)
        if (params.phone) filledSummary.push(`phone as ${params.phone}`)
        if (params.specialty) filledSummary.push(`specialty as ${params.specialty}`)
        if (params.message) filledSummary.push(`a short message`)
        const recap = filledSummary.length ? filledSummary.join(', ') : `${filled} field${filled === 1 ? '' : 's'}`

        const clicked = await attemptSubmit()
        if (!clicked) {
          setTimeout(() => setActionLabel(''), 1500)
          return `I've filled in ${recap}. Please take a quick look — if it all looks right, click Submit to send it through. If anything needs changing, edit it directly in the form.`
        }

        const confirmed = await watchForSuccess()
        setTimeout(() => setActionLabel(''), 1500)
        if (confirmed) {
          return `I've filled in ${recap} and clicked Submit. Please glance at the confirmation on screen to make sure it went through — and if anything was off, let me know or reach out to the team directly.`
        }
        // Submit clicked but no confirmation within the window. Don't claim success.
        return `I've filled in ${recap} and clicked Submit. Please check the screen to confirm it went through — if it didn't, you can edit anything and click Submit yourself, otherwise the team will follow up within one business day.`
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
        // No match — don't silently scroll somewhere misleading. Let the agent recover.
        return done(`I couldn\'t find a section called "${params.section_id}" on this page. Could you tell me what you want to see?`)
      },

      // Read current page content — headings + paragraphs + key data + form fields, capped for speed
      read_page: () => {
        const main = document.querySelector('main')
        if (!main) return `Page: ${window.location.pathname}`
        const parts: string[] = []
        let charCount = 0
        // Unified budget gate — 2500 char total, 300 char per item.
        // Returns true if the part was added, false if it was skipped or truncated away.
        const pushPart = (text: string): boolean => {
          const normalized = text.trim()
          if (!normalized) return false
          if (normalized.length > 300) return false
          const nextSize = normalized.length + 1 // +1 for the newline join
          if (charCount + nextSize > 2500) return false
          parts.push(normalized)
          charCount += nextSize
          return true
        }
        for (const el of Array.from(main.querySelectorAll(
          'h1, h2, h3, .section-label, .section-title, p, li, ' +
          '.result-number span, .result-label, .hero-sub'
        ))) {
          if (charCount >= 2500) break
          if (el.closest('nav, footer, [style*="position: fixed"]')) continue
          const text = (el.textContent || '').trim().replace(/\s+/g, ' ')
          if (text.length > 1) pushPart(text)
        }
        // Detect forms and their fields — same budget gate as content above.
        const forms = main.querySelectorAll('form')
        if (forms.length > 0) {
          // If the header won't fit, skip the form section entirely.
          if (pushPart('--- Form fields on this page ---')) {
            outer: for (const form of Array.from(forms)) {
              for (const input of Array.from(form.querySelectorAll('input[name], textarea[name], select[name]'))) {
                const name = input.getAttribute('name') || ''
                const tag = input.tagName.toLowerCase()
                if (tag === 'select') {
                  const realOptions = Array.from((input as HTMLSelectElement).options)
                    .filter(o => o.value) // exclude placeholder/empty
                    .map(o => o.textContent?.trim())
                    .filter((o): o is string => !!o)
                  const total = realOptions.length
                  const sample = realOptions.slice(0, 20)
                  const hasOther = realOptions.some(o => o.toLowerCase() === 'other')
                  let desc = `Dropdown "${name}": ${total} option${total === 1 ? '' : 's'}`
                  desc += total > 0 ? ` including: ${sample.join(', ')}${total > 20 ? '... and more' : ''}.` : '.'
                  // Only append the "Other → custom text" guidance when it's actually applicable.
                  if (name === 'specialty' && hasOther) {
                    desc += ' If not listed, select "Other" and a text box will appear.'
                  }
                  // If desc exceeds per-item cap, trim to a shorter summary and retry.
                  if (desc.length > 300) desc = `Dropdown "${name}": ${total} options (list too long to include).`
                  if (!pushPart(desc)) break outer
                } else {
                  const type = input.getAttribute('type') || tag
                  if (!pushPart(`Field "${name}" (${type})`)) break outer
                }
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

  // PAGE AWARENESS: Notify agent of navigation.
  // - Debounce: 1s (was 3s) so fast clicks don't desync her context.
  // - Queue during speech: if debounce fires while she's talking, stash and flush
  //   after she finishes. Previously these updates were silently dropped.
  const lastSentPath = useRef('')
  const pendingPathRef = useRef<string | null>(null)
  const contextTimerRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    if (!isConnected || !pathname) return
    if (pathname === lastSentPath.current) return
    if (contextTimerRef.current) clearTimeout(contextTimerRef.current)
    contextTimerRef.current = setTimeout(() => {
      if (!isConnected) return
      if (isSpeaking) { pendingPathRef.current = pathname; return }
      lastSentPath.current = pathname
      try { conversation.sendContextualUpdate(`User is now on: ${pathname}`) } catch {}
    }, 1000)
    return () => { if (contextTimerRef.current) clearTimeout(contextTimerRef.current) }
  }, [pathname, isConnected, isSpeaking]) // eslint-disable-line react-hooks/exhaustive-deps

  // Flush queued update once she stops speaking.
  useEffect(() => {
    if (!isConnected || isSpeaking) return
    const pending = pendingPathRef.current
    if (!pending || pending === lastSentPath.current) return
    pendingPathRef.current = null
    lastSentPath.current = pending
    try { conversation.sendContextualUpdate(`User is now on: ${pending}`) } catch {}
  }, [isSpeaking, isConnected]) // eslint-disable-line react-hooks/exhaustive-deps

  // Blink (PR fix: cleanup nested timeout to prevent memory leak).
  // Only runs while Cindy is visible — no point animating a hidden component.
  useEffect(() => {
    if (dismissed || !showPopup) return
    const intervalId = setInterval(() => {
      setBlinking(true)
      blinkTimeoutRef.current = setTimeout(() => setBlinking(false), 150)
    }, 3500)
    return () => {
      clearInterval(intervalId)
      if (blinkTimeoutRef.current) clearTimeout(blinkTimeoutRef.current)
    }
  }, [dismissed, showPopup])

  const [startError, setStartError] = useState<string | null>(null)

  const startConversation = useCallback(async () => {
    setStartError(null)
    // Drop any stale queued pathname from a prior session.
    pendingPathRef.current = null
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
      // Map common errors to user-facing messages
      const name = (e as { name?: string })?.name || ''
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setStartError('Microphone permission was blocked. Enable it in your browser settings to talk with Grace.')
      } else if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
        setStartError('No microphone was found. Plug one in and try again.')
      } else {
        setStartError('Couldn\'t start the conversation. Please try again.')
      }
    }
  }, [conversation, pathname])

  const endConversation = useCallback(() => { conversation.endSession() }, [conversation])

  const dismissCindy = () => {
    if (isConnected) conversation.endSession()
    setDismissed(true); setShowPopup(false)
    try { window.localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_TTL_MS)) } catch {}
  }

  const restoreCindy = () => {
    setDismissed(false); setShowPopup(true)
    try { window.localStorage.removeItem(DISMISS_KEY) } catch {}
  }

  const stateLabel = actionLabel || (!isConnected ? 'Grace — AI Guide' : isSpeaking ? 'Speaking...' : 'Listening...')

  return (
    <>
      {dismissed && (
        <button onClick={restoreCindy} aria-label="Talk to Grace" className="cindy-avatar" style={{ position: 'fixed', bottom: 110, right: 28, zIndex: 9998, width: 56, height: 56, borderRadius: '50%', border: '3px solid #00B5D6', overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'white', boxShadow: '0 4px 20px rgba(0,181,214,0.3)', animation: 'cindyPulse 2s ease-in-out infinite' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/cindy.png" alt="Grace" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </button>
      )}

      {showPopup && !dismissed && (
        <div className="cindy-panel" style={{ position: 'fixed', bottom: 110, right: 28, zIndex: 9998, width: 320, borderRadius: 20, overflow: 'hidden', background: 'white', border: '2px solid #00B5D6', boxShadow: '0 20px 60px rgba(0,181,214,0.25)', animation: 'cindySlideUp 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
          <button onClick={dismissCindy} aria-label="Close Grace" style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: 'rgba(255,255,255,0.20)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 14, transition: 'background 200ms ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.35)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.20)' }}>✕</button>

          <div style={{ background: 'linear-gradient(135deg, #00B5D6 0%, #0090A8 100%)', padding: '24px 24px 32px', textAlign: 'center' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', margin: '0 auto 12px', border: '3px solid white', overflow: 'hidden', position: 'relative', boxShadow: isListening ? '0 0 0 4px rgba(255,255,255,0.4), 0 0 20px rgba(255,255,255,0.3)' : '0 4px 16px rgba(0,0,0,0.2)', animation: isSpeaking ? 'cindyBob 0.4s ease-in-out infinite' : isListening ? 'cindyGlow 1.5s ease-in-out infinite' : 'cindyBreathe 3s ease-in-out infinite' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/cindy.png" alt="Grace" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: blinking ? 'scaleY(0.97)' : 'scaleY(1)', transition: 'transform 0.1s ease' }} />
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
                  Hi! I&apos;m <strong style={{ color: '#00B5D6' }}>Grace</strong>, your AI voice guide. I can navigate, fill forms, and answer any questions. Ready?
                </p>
                {startError && (
                  <p role="alert" style={{ fontSize: 12, lineHeight: 1.5, color: '#8B0000', background: '#FFF4F4', border: '1px solid #F5C5C5', borderRadius: 8, padding: '8px 12px', margin: '0 0 12px' }}>
                    {startError}
                  </p>
                )}
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
        @media (max-width: 480px) {
          .cindy-panel { right: 12px !important; left: 12px !important; bottom: 80px !important; width: auto !important; }
          .cindy-avatar { right: 16px !important; bottom: 80px !important; }
        }
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
