'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ConversationProvider, useConversation } from '@elevenlabs/react'
import SiriWave from 'siriwave'
import { pageContext } from '@/lib/page-meta'

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

  // Mobile-only state.
  //   isMobile     — viewport ≤480px. Drives the slim Siri-style strip
  //                  + small FAB pattern instead of the desktop welcome card.
  //   isStarting   — true between calling startConversation() and the
  //                  WebSocket finishing its handshake (onConnect / onError
  //                  / onDisconnect). The strip renders during this gap so
  //                  the tap has immediate feedback even on a slow connect.
  const [isMobile, setIsMobile] = useState(false)
  const [isStarting, setIsStarting] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(max-width: 480px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // SiriWave (kopiro/siriwave npm) replaces the previous hand-rolled SVG
  // for the mobile conversation strip. siriWaveContainerRef points at the
  // <div> inside the strip; siriWaveRef holds the live SiriWave instance
  // so the audio-reactive RAF loop below can call setAmplitude on it.
  const siriWaveContainerRef = useRef<HTMLDivElement | null>(null)
  const siriWaveRef = useRef<SiriWave | null>(null)

  // Persisted dismissal — respects user's choice across refreshes + 24h across sessions.
  // Key stores epoch ms of expiry. If now < expiry, stay dismissed.
  const DISMISS_KEY = 'cindy-dismissed-until'
  const DISMISS_TTL_MS = 24 * 60 * 60 * 1000 // 24h

  // Delay Grace popup by 5 seconds — but skip entirely if recently dismissed.
  useEffect(() => {
    let dismissedUntil = 0
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(DISMISS_KEY) : null
      if (raw) dismissedUntil = parseInt(raw, 10) || 0
    } catch { /* localStorage blocked — fall through to default behavior */ }
    if (dismissedUntil > Date.now()) { setDismissed(true); return }
    const timer = setTimeout(() => setShowPopup(true), 5000)
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
      setIsStarting(false) // mobile strip: clear the 'connecting' state once the WS handshake lands
      try { window.sessionStorage.setItem('cindy-conversation-id', conversationId) } catch {}
    },
    onDisconnect: () => {
      setActionLabel('Conversation ended'); setTimeout(() => setActionLabel(''), 2000)
      setIsStarting(false) // mobile strip: cover the edge case where we disconnect before fully connecting
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
    onError: (error: string) => { console.error('Cindy error:', error); setActionLabel(''); setIsStarting(false) },
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

      fill_form: async (params: {
        practice_name?: string; contact_name?: string;
        // Aliases — ElevenLabs tool schema may declare these under different
        // identifiers ("name" instead of "contact_name", "company" instead of
        // "practice_name"). Without these aliases, the schema mismatch silently
        // drops both name fields and the form submits with blank names.
        name?: string; full_name?: string;
        company?: string; practice?: string; practice_full_name?: string;
        email?: string; phone?: string; specialty?: string; message?: string
      }) => {
        setActionLabel('Filling form...')

        // Normalize aliases into the two distinct fields the form actually uses.
        // contact_name = the human; practice_name = the clinic. ElevenLabs LLMs
        // sometimes conflate these, so we resolve in priority order.
        const practiceName = params.practice_name || params.company || params.practice_full_name || params.practice || ''
        const contactName  = params.contact_name  || params.full_name || params.name             || ''

        // Stay on whichever /contact/[location] page the user is on so the lead
        // attributes to that office. /contact alone 308-redirects to Irvine,
        // which was previously causing all leads to mis-attribute.
        const onLocationPage = window.location.pathname.startsWith('/contact/')
        const needsNav = !onLocationPage
        if (needsNav) router.push('/contact/irvine')

        // Wait for page — shorter wait + element polling instead of fixed 1800ms
        const waitMs = needsNav ? 800 : 100
        await new Promise(r => setTimeout(r, waitMs))

        // Poll for the contact form by its id, not by any random input on
        // the page. Scoping to #contact-form means we can't ever pick up a
        // footer newsletter, the chat widget, or any other form that happens
        // to share field names. If #contact-form isn't on the page within
        // 1.6s, we abort honestly.
        let form: HTMLFormElement | null = null
        for (let i = 0; i < 8; i++) {
          form = document.getElementById('contact-form') as HTMLFormElement | null
          if (form && form.querySelector('input[name="practiceName"]')) break
          form = null
          await new Promise(r => setTimeout(r, 200))
        }

        if (!form) {
          setActionLabel('')
          // Truthful failure — form didn't load. Give agent a workable path
          // instead of falsely claiming success. Phone matches site-wide CTA.
          return 'I couldn\'t reach the contact form — you can call the team directly at (877) 806-2286 or I can try again.'
        }

        // Scroll to form BEFORE filling so the user watches it populate.
        // 300ms settle delay gives smooth-scroll a moment before fields change.
        form.scrollIntoView({ behavior: 'smooth', block: 'start' })
        await new Promise(r => setTimeout(r, 300))

        // Fill fields — uses the normalized names resolved at the top of this
        // function, so ElevenLabs schema aliases (name/company) end up in the
        // right DOM inputs (contactName/practiceName).
        const fieldMap: Record<string, string> = {
          practiceName, contactName,
          email: params.email || '', phone: params.phone || '', message: params.message || '',
        }
        let filled = 0
        for (const [name, value] of Object.entries(fieldMap)) {
          if (!value) continue
          const el = form.querySelector(`input[name="${name}"], textarea[name="${name}"]`) as HTMLInputElement | HTMLTextAreaElement | null
          if (el) {
            const proto = el.tagName === 'TEXTAREA' ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
            const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
            if (setter) { setter.call(el, value); el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); filled++ }
          }
        }
        if (params.specialty) {
          const select = form.querySelector('select[name="specialty"]') as HTMLSelectElement | null
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
                customInput = form.querySelector('input[name="customSpecialty"]') as HTMLInputElement | null
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
        // Scoped to `form` (the resolved #contact-form element) so we never click a
        // submit button belonging to a different form on the page.
        const attemptSubmit = async (): Promise<boolean> => {
          for (let attempt = 0; attempt < 3; attempt++) {
            if (attempt > 0) await new Promise(r => setTimeout(r, 300))
            const submitBtn = form.querySelector('button[type="submit"]:not([disabled])') as HTMLButtonElement | null
            if (submitBtn) { setActionLabel('Submitting...'); submitBtn.click(); return true }
          }
          // Last resort: requestSubmit on the resolved form (NOT document.querySelector('form'),
          // which would pick the first form on the page — could be a different form).
          setActionLabel('Submitting...'); form.requestSubmit(); return true
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

        // Build a recap of what was filled so Grace can read it back.
        // Uses the normalized practiceName/contactName so the recap matches
        // what actually went into the form (in case schema aliases were used).
        const filledSummary: string[] = []
        if (practiceName) filledSummary.push(`practice name as ${practiceName}`)
        if (contactName)  filledSummary.push(`contact name as ${contactName}`)
        if (params.email) filledSummary.push(`email as ${params.email}`)
        if (params.phone) filledSummary.push(`phone as ${params.phone}`)
        if (params.specialty) filledSummary.push(`specialty as ${params.specialty}`)
        if (params.message) filledSummary.push(`a short message`)
        const recap = filledSummary.length ? filledSummary.join(', ') : `${filled} field${filled === 1 ? '' : 's'}`

        // Three return paths, each a single coherent outcome. The previous
        // implementation hedged ("I clicked Submit and ALSO please click Submit
        // yourself"), which Grace parroted back to users and sounded broken.
        // Pick exactly one truth per call and commit to it.
        const clicked = await attemptSubmit()
        if (!clicked) {
          setTimeout(() => setActionLabel(''), 1500)
          return `I've filled in ${recap}, but I couldn't find the Submit button on this page. Everything's ready — could you click Submit at the bottom of the form?`
        }

        const confirmed = await watchForSuccess()
        setTimeout(() => setActionLabel(''), 1500)
        if (confirmed) {
          return `Submitted. The team will follow up within one business day.`
        }
        // Clicked Submit but the "Thank you" confirmation didn't show within
        // 1.5s. State exactly that — don't pretend it succeeded, don't ask the
        // user to re-submit. Could just be slow network.
        return `I clicked Submit and the form's processing — can you glance at the screen and tell me if you see a Thank you message?`
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
      // Send pathname + curated summary + live H1/hash/form-present snapshot.
      // Without the summary, Grace only knows the URL and has to guess content
      // from her KB, which she does badly.
      try { conversation.sendContextualUpdate(`User is now on: ${pathname}. ${pageContext(pathname)}`) } catch {}
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
    try { conversation.sendContextualUpdate(`User is now on: ${pending}. ${pageContext(pending)}`) } catch {}
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

  // Create the SiriWave instance once the strip is mounted, dispose on
  // unmount. Only runs on mobile (the only place the canvas container
  // exists). Uses the ios9 style (modern multi-curve Siri look) which
  // ships with a built-in red/green/blue palette and supports the
  // setAmplitude / setSpeed interpolated controls used below.
  useEffect(() => {
    if (!isMobile) return
    if (!(isStarting || isConnected)) return
    const el = siriWaveContainerRef.current
    if (!el) return
    const inst = new SiriWave({
      container: el,
      style: 'ios9',
      cover: true,        // canvas fills the container
      speed: 0.18,
      amplitude: 0.6,     // baseline; the RAF loop below modulates it
      autostart: true,
      ranges: {
        // Slight palette nudge towards the brighter Apple system colours
        // so the screen-blended overlap reads on a dark glass background.
        speed: [0.5, 1.2],
        amplitude: [0.3, 1.4],
      },
    })
    siriWaveRef.current = inst
    return () => {
      try { inst.dispose() } catch { /* dispose can throw if container already gone */ }
      siriWaveRef.current = null
    }
  }, [isMobile, isStarting, isConnected])

  // Audio-reactive amplitude. Polls ElevenLabs' getInputVolume() and
  // getOutputVolume() on every animation frame and feeds the louder
  // of the two into SiriWave.setAmplitude. Output volume drives the
  // wave when Grace is speaking; input drives it when the user is
  // talking. When neither is producing audio the wave eases back to a
  // small idle baseline rather than dying flat.
  useEffect(() => {
    if (!isConnected || !isMobile) return
    let rafId = 0
    const loop = () => {
      const wave = siriWaveRef.current
      if (wave) {
        // The volume getters are typed loosely on the SDK; use a soft
        // cast + try/catch so a SDK version without them just degrades
        // to the baseline animation.
        let v = 0
        try {
          const c = conversation as unknown as { getInputVolume?: () => number; getOutputVolume?: () => number }
          const inp = c.getInputVolume?.() ?? 0
          const out = c.getOutputVolume?.() ?? 0
          v = Math.max(inp, out)
        } catch { /* fall through to baseline */ }
        // 0-1 input → 0.25-1.6 amplitude. Lower bound keeps the wave
        // visible during silence; upper bound lets a loud speaker punch.
        wave.setAmplitude(0.25 + v * 1.35)
      }
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [isConnected, isMobile, conversation])

  // Cross-component coordination: if the user opens the text chat
  // (ChatWidget dispatches 'grace-chat-opened' on its FAB click) while
  // the voice conversation is live, end the voice session automatically.
  // Per user instruction Jun 2026: "if [the user clicks] chat, the Grace
  // voice should switch off automatically".
  useEffect(() => {
    if (!isConnected && !isStarting) return
    const handler = () => { try { conversation.endSession() } catch {} }
    window.addEventListener('grace-chat-opened', handler)
    return () => window.removeEventListener('grace-chat-opened', handler)
  }, [isConnected, isStarting, conversation])

  const [startError, setStartError] = useState<string | null>(null)

  const startConversation = useCallback(async () => {
    setStartError(null)
    setIsStarting(true) // mobile strip: show the strip immediately so the tap on the FAB has visible feedback
    // Drop any stale queued pathname from a prior session.
    pendingPathRef.current = null
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      lastSentPath.current = pathname || '/'
      conversation.startSession({
        agentId: AGENT_ID,
        connectionType: 'websocket',
        // current_page is the URL; current_page_summary is what's on it.
        // Both are passed to ElevenLabs as dynamic variables and can be
        // referenced from the system prompt or knowledge base.
        dynamicVariables: {
          current_page: pathname || '/',
          current_page_summary: pageContext(pathname || '/'),
        },
      })
    } catch (e) {
      setIsStarting(false) // bail out of the 'connecting' UI on mic-permission / device errors
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

  const stateLabel = actionLabel || (!isConnected ? 'Grace — Ai Guide' : isSpeaking ? 'Speaking...' : 'Listening...')

  // Mobile FAB tap = auto-start the conversation (per user feedback Jun 2026).
  // If we're in the dismissed state, un-dismiss first so the FAB doesn't keep
  // hiding itself between conversations.
  const handleMobileFABTap = useCallback(() => {
    if (dismissed) {
      setDismissed(false)
      setShowPopup(true)
      try { window.localStorage.removeItem(DISMISS_KEY) } catch {}
    }
    startConversation()
  }, [dismissed, startConversation])

  return (
    <>
      {/* Desktop only: existing dismissed-state restore FAB. Tap brings the
          welcome card back so the user can read the intro again before
          starting. Mobile uses handleMobileFABTap below instead. */}
      {!isMobile && dismissed && (
        <button onClick={restoreCindy} aria-label="Talk to Grace" className="cindy-avatar" style={{ position: 'fixed', bottom: 110, right: 28, zIndex: 9998, width: 56, height: 56, borderRadius: '50%', border: '3px solid #00B5D6', overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'white', boxShadow: '0 4px 20px rgba(0,181,214,0.3)', animation: 'cindyPulse 2s ease-in-out infinite' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/grace-avatar.png" alt="Grace" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </button>
      )}

      {/* Mobile only: small Grace FAB. Visible whenever Grace is summonable
          (initial 5s timer fired OR user previously dismissed) and we're not
          mid-conversation. Tap auto-starts the conversation; the slim strip
          below takes over once startConversation() begins. Position matches
          the original cindy-avatar @480px override exactly (right: 16,
          bottom: 80) — no safe-area-inset offset, which had been pushing
          this FAB up on devices with a home indicator and shifting the
          stacked alignment with the chat FAB below it. */}
      {isMobile && (dismissed || showPopup) && !isStarting && !isConnected && (
        <button onClick={handleMobileFABTap} aria-label="Talk to Grace" className="cindy-mobile-fab" style={{ position: 'fixed', bottom: 80, right: 16, zIndex: 9998, width: 56, height: 56, borderRadius: '50%', border: '3px solid #00B5D6', overflow: 'hidden', cursor: 'pointer', padding: 0, background: 'white', boxShadow: '0 4px 20px rgba(0,181,214,0.3)', animation: 'cindyPulse 2s ease-in-out infinite' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/grace-avatar.png" alt="Grace" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </button>
      )}

      {showPopup && !dismissed && !isMobile && (
        <div className="cindy-panel" style={{ position: 'fixed', bottom: 110, right: 28, zIndex: 9998, width: 320, borderRadius: 20, overflow: 'hidden', background: 'white', border: '2px solid #00B5D6', boxShadow: '0 20px 60px rgba(0,181,214,0.25)', animation: 'cindySlideUp 0.6s cubic-bezier(0.16,1,0.3,1)' }}>
          <button onClick={dismissCindy} aria-label="Close Grace" style={{ position: 'absolute', top: 12, right: 12, zIndex: 10, background: 'rgba(255,255,255,0.20)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 14, transition: 'background 200ms ease' }} onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.35)' }} onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.20)' }}>✕</button>

          <div style={{ background: 'linear-gradient(135deg, #00B5D6 0%, #0090A8 100%)', padding: '24px 24px 32px', textAlign: 'center' }}>
            <div style={{ width: 100, height: 100, borderRadius: '50%', margin: '0 auto 12px', border: '3px solid white', overflow: 'hidden', position: 'relative', boxShadow: isListening ? '0 0 0 4px rgba(255,255,255,0.4), 0 0 20px rgba(255,255,255,0.3)' : '0 4px 16px rgba(0,0,0,0.2)', animation: isSpeaking ? 'cindyBob 0.4s ease-in-out infinite' : isListening ? 'cindyGlow 1.5s ease-in-out infinite' : 'cindyBreathe 3s ease-in-out infinite' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/grace-avatar.png" alt="Grace" style={{ width: '100%', height: '100%', objectFit: 'cover', transform: blinking ? 'scaleY(0.97)' : 'scaleY(1)', transition: 'transform 0.1s ease' }} />
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
                  Hi! I&apos;m <strong style={{ color: '#00B5D6' }}>Grace</strong>, your Ai voice guide. I can navigate, fill forms, and answer any questions. Ready?
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

      {/* Mobile only: full-width glass pill with audio-reactive SiriWave canvas.
          Position matches the original cindy-panel @480px alignment so it
          sits exactly where the old welcome card used to be (left/right 12px,
          bottom 80px). Renders while the conversation is starting up and
          while it's connected. Layout: [X close on left] [wave fills rest].
          The wave amplitude is driven from ElevenLabs' getInputVolume /
          getOutputVolume so it reacts to the actual speaking voice. */}
      {isMobile && (isStarting || isConnected) && (
        <div className="cindy-mobile-strip" role="dialog" aria-label="Grace voice conversation" style={{
          position: 'fixed',
          left: 12, right: 12, bottom: 80,
          zIndex: 9998,
          height: 76,
          borderRadius: 999,
          background: 'rgba(18, 20, 32, 0.55)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
          animation: 'cindyStripSlideUp 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          overflow: 'hidden',
        }}>
          {/* Close X on the LEFT (per user preference Jun 2026). Ends the
              conversation only; the FAB will reappear so Grace can be
              re-summoned without a 24h cooldown. */}
          <button onClick={endConversation} aria-label="End conversation" style={{
            position: 'absolute', top: '50%', left: 12,
            transform: 'translateY(-50%)',
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.14)',
            color: 'rgba(255,255,255,0.9)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, padding: 0, lineHeight: 1,
            zIndex: 2,
          }}>✕</button>

          {/* SiriWave canvas container — fills the area to the right of
              the X. The canvas is created in useEffect below
              (siriwave.js ios9 style), and its amplitude is driven by
              the ElevenLabs audio-volume polling loop. */}
          <div
            ref={siriWaveContainerRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 60, right: 16, top: 0, bottom: 0,
              pointerEvents: 'none',
            }}
          />

          {/* Error banner — sits as its own pill ABOVE the strip if
              startConversation caught a mic-permission or no-device error. */}
          {startError && (
            <div role="alert" style={{
              position: 'absolute', left: 0, right: 0, bottom: 'calc(100% + 8px)',
              fontSize: 12, lineHeight: 1.5, color: '#fff',
              background: 'rgba(139,0,0,0.88)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              borderRadius: 14,
              padding: '8px 14px',
              textAlign: 'center',
            }}>
              {startError}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes cindySlideUp { from { opacity: 0; transform: translateY(40px) scale(0.9); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cindyStripSlideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
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
