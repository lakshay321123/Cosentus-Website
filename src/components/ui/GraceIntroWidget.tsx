'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { useChat } from './ChatContext'

// GraceIntroWidget — circular intro video (bottom-right, desktop only).
//
// Replaces the old CindyVoiceAgent desktop welcome card (retired Jul 2026).
// Behaviour per the "Cosentus_Website_Grace_Video_How_to_Show" deck:
//   State 1 (front face): Grace intro video autoplays muted in a circle,
//     with a SKIP label above it and a thin progress bar inside.
//   State 2 (back face):  when the video ends or is skipped, the circle
//     flips to a "Start a Conversation" disc with a mic icon (starts the
//     Grace voice session) and a keyboard icon (opens the text chat).
//
// Shows on every page load — deliberately no dismiss cooldown.
//
// Cross-component wiring (window events, same decoupled pattern as
// grace-chat-opened / grace-voice-started):
//   dispatches 'grace-open-voice'   → CindyVoiceAgent starts the session
//   dispatches 'grace-chat-opened'  → CindyVoiceAgent ends any live session
//   dispatches 'grace-intro-shown' / 'grace-intro-hidden'
//                                   → ChatWidget hides/shows its chat FAB
//   listens to 'grace-voice-started' / 'grace-voice-ended'
//                                   → hides itself while voice UI is live
//
// All styles live in app/globals.css (.grace-intro-*). Do NOT move them
// into a client-injected <style> block — that pattern caused the known
// SSR/client hydration mismatch in CindyVoiceAgent.
export default function GraceIntroWidget() {
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(true) // assume mobile until measured — renders nothing
  const [face, setFace] = useState<'video' | 'menu'>('video')
  const [voiceActive, setVoiceActive] = useState(false)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0) // 0..1
  const [videoFailed, setVideoFailed] = useState(false)
  // User-hidden via the circle's ✕ — collapses to the small avatar FAB
  // (the pre-widget bottom-right stack: small Grace circle + chat FAB).
  // Resets on every page load, consistent with the widget itself.
  const [hidden, setHidden] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { isOpen, setIsOpen } = useChat()

  // Mobile placement (rework Jul 2026 after fixed-corner feedback):
  // on ≤480px the circle is NOT a fixed overlay — short viewports put
  // whatever section follows the hero under it and it collides with
  // content. Instead it portals into #grace-intro-inline-slot inside
  // the home hero (headline → sub → buttons → centered circle) and
  // scrolls away naturally. Pages without the slot get no circle on
  // mobile — the idle pill stays their voice entry.
  const pathname = usePathname()
  const [slotEl, setSlotEl] = useState<HTMLElement | null>(null)
  useEffect(() => {
    // Re-query per navigation: the slot lives in page content, which
    // remounts on route change while this widget (site layout) persists.
    setSlotEl(document.getElementById('grace-intro-inline-slot'))
  }, [pathname, mounted])

  // Is the inline circle actually in view? Drives mobile corner
  // ownership: circle visible → pill hidden; scrolled past → pill back.
  // Two-way by design (unlike desktop's one-way collapse) because the
  // in-flow circle naturally re-enters the viewport when scrolling up.
  const inlineWrapRef = useRef<HTMLDivElement>(null)
  const [inlineInView, setInlineInView] = useState(false)
  useEffect(() => {
    if (!isMobile || !slotEl || hidden) { setInlineInView(false); return }
    const el = inlineWrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => setInlineInView(entries[0].isIntersecting),
      { threshold: 0.35 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [isMobile, slotEl, hidden, isOpen])

  useEffect(() => {
    setMounted(true)
    const mq = window.matchMedia('(max-width: 480px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Hide while the Grace voice UI (connecting strip / live conversation
  // bar) is on screen. CindyVoiceAgent dispatches these on its
  // isStarting || isConnected transitions.
  useEffect(() => {
    const onStart = () => setVoiceActive(true)
    const onEnd = () => setVoiceActive(false)
    window.addEventListener('grace-voice-started', onStart)
    window.addEventListener('grace-voice-ended', onEnd)
    return () => {
      window.removeEventListener('grace-voice-started', onStart)
      window.removeEventListener('grace-voice-ended', onEnd)
    }
  }, [])

  // Corner-ownership intent vs render visibility:
  //   Desktop — intent = mounted && !hidden && !isOpen (fixed circle
  //     owns the corner until collapsed; one-way scroll collapse below).
  //   Mobile — intent = the inline hero circle is meaningfully in view.
  //     Two-way: scroll past → pill + chat FAB come back; scroll up →
  //     circle re-enters, pill hides again. Ignores voiceActive in both
  //     cases: CindyVoiceAgent's idle pill dispatches
  //     'grace-voice-started' whenever the pill itself is on screen, so
  //     keying intent on voiceActive would deadlock pill vs circle.
  const intent = mounted && !hidden && !isOpen && (isMobile ? inlineInView : true)
  const visible = intent && !voiceActive
  // Desktop-only: collapsed state shows our small restore avatar. On
  // mobile, collapsing/scrolling away returns to the original mobile
  // UX — idle pill + chat FAB.
  const showRestoreFab = mounted && !isMobile && !voiceActive && !isOpen && hidden

  // Claim/release the corner. CindyVoiceAgent (idle pill + mobile FAB)
  // and ChatWidget (chat FAB) both listen for these.
  useEffect(() => {
    if (!mounted) return
    try {
      window.dispatchEvent(new Event(intent ? 'grace-intro-shown' : 'grace-intro-hidden'))
    } catch {}
    return () => {
      if (intent) {
        try { window.dispatchEvent(new Event('grace-intro-hidden')) } catch {}
      }
    }
  }, [mounted, intent])

  // If the chat panel takes over mid-video, don't resume the pitch
  // afterwards — come back on the menu face. voiceActive is deliberately
  // NOT part of this: the mobile idle pill's transient 'grace-voice-started'
  // at bootstrap would skip the video before it ever played.
  useEffect(() => {
    if (mounted && isOpen && face === 'video') setFace('menu')
  }, [mounted, isOpen, face])

  const skip = useCallback(() => {
    try { videoRef.current?.pause() } catch {}
    setFace('menu')
  }, [])

  const toggleSound = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.muted) {
      // Unmuting mid-pitch would drop the viewer into the middle of the
      // message — restart from the top with sound (user instruction Jul 2026).
      v.muted = false
      v.currentTime = 0
      setProgress(0)
      v.play().catch(() => {})
      setMuted(false)
    } else {
      v.muted = true
      setMuted(true)
    }
  }, [])

  const openVoice = useCallback(() => {
    try { window.dispatchEvent(new Event('grace-open-voice')) } catch {}
  }, [])

  const openChat = useCallback(() => {
    // Ends any live voice session (existing CindyVoiceAgent listener).
    try { window.dispatchEvent(new Event('grace-chat-opened')) } catch {}
    setIsOpen(true)
  }, [setIsOpen])

  const hideWidget = useCallback(() => {
    try { videoRef.current?.pause() } catch {}
    setFace('menu') // come back on the menu face after any restore
    setHidden(true)
  }, [])

  // Auto-collapse on scroll: the big circle belongs to the hero. The first
  // time the user scrolls past ~80% of a viewport height, collapse to the
  // small-circles state. Fires at most ONCE per page load (autoCollapsed
  // ref) — otherwise restoring via the small avatar while still scrolled
  // down would instantly re-collapse. Scrolling back up never reopens it;
  // the restore avatar does. Initial check handles loads that start
  // mid-page (browser back / anchor links).
  const autoCollapsedRef = useRef(false)
  useEffect(() => {
    if (!mounted || isMobile || hidden || autoCollapsedRef.current) return
    const onScroll = () => {
      if (autoCollapsedRef.current) return
      if (window.scrollY > window.innerHeight * 0.8) {
        autoCollapsedRef.current = true
        hideWidget()
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mounted, isMobile, hidden, hideWidget])

  const restoreWidget = useCallback(() => setHidden(false), [])

  const showVideo = face === 'video' && !videoFailed

  // Shared circle markup. variant 'fixed' = desktop bottom-right overlay;
  // 'inline' = mobile in-flow hero circle (centered, scrolls with content).
  const circle = (variant: 'fixed' | 'inline') => (
    <div
      ref={variant === 'inline' ? inlineWrapRef : undefined}
      className={`grace-intro${variant === 'inline' ? ' grace-intro--inline' : ''}`}
      role="complementary"
      aria-label="Grace — Ai RCM Representative"
    >
      {showVideo && (
        <button className="grace-intro-skip" onClick={skip} aria-label="Skip intro video">
          SKIP
        </button>
      )}
      {!showVideo && (
        <button className="grace-intro-hide" onClick={hideWidget} aria-label="Hide Grace widget">
          ✕
        </button>
      )}
      <div className={`grace-intro-flip${showVideo ? '' : ' is-flipped'}`}>
        {/* Front face — intro video */}
        <div className="grace-intro-face grace-intro-front">
          <video
            ref={videoRef}
            className="grace-intro-video"
            src={isMobile ? '/videos/grace-intro-mobile.mp4' : '/videos/grace-intro.mp4'}
            autoPlay
            muted
            playsInline
            preload="auto"
            onEnded={() => setFace('menu')}
            onError={(e) => {
              // Only fall back when the element reports a real MediaError.
              // Transient error events during load (no v.error set) recover
              // on their own and must not permanently skip the video.
              if (e.currentTarget.error) { setVideoFailed(true); setFace('menu') }
            }}
            onTimeUpdate={(e) => {
              const v = e.currentTarget
              if (v.duration > 0) setProgress(v.currentTime / v.duration)
            }}
          />
          <button
            className="grace-intro-sound"
            onClick={toggleSound}
            aria-label={muted ? 'Unmute intro video' : 'Mute intro video'}
          >
            {muted ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="white" stroke="none" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="white" stroke="none" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              </svg>
            )}
          </button>
          <div className="grace-intro-progress" aria-hidden="true">
            <div className="grace-intro-progress-fill" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        </div>

        {/* Back face — Start a Conversation */}
        <div className="grace-intro-face grace-intro-back">
          <div className="grace-intro-menu-title">
            Start a<br />Conversation
          </div>
          <div className="grace-intro-menu-icons">
            <button className="grace-intro-icon-btn" onClick={openVoice} aria-label="Talk to Grace by voice">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="2" width="6" height="12" rx="3" />
                <path d="M5 10v1a7 7 0 0 0 14 0v-1" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="8.5" y1="22" x2="15.5" y2="22" />
              </svg>
            </button>
            <button className="grace-intro-icon-btn" onClick={openChat} aria-label="Chat with Grace by text">
              <svg width="44" height="34" viewBox="0 0 32 22" fill="none" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="1" width="30" height="20" rx="2.5" />
                <line x1="5" y1="6" x2="5" y2="6" strokeWidth="2" />
                <line x1="10" y1="6" x2="10" y2="6" strokeWidth="2" />
                <line x1="15" y1="6" x2="15" y2="6" strokeWidth="2" />
                <line x1="20" y1="6" x2="20" y2="6" strokeWidth="2" />
                <line x1="25" y1="6" x2="25" y2="6" strokeWidth="2" />
                <line x1="5" y1="11" x2="5" y2="11" strokeWidth="2" />
                <line x1="10" y1="11" x2="10" y2="11" strokeWidth="2" />
                <line x1="15" y1="11" x2="15" y2="11" strokeWidth="2" />
                <line x1="20" y1="11" x2="20" y2="11" strokeWidth="2" />
                <line x1="25" y1="11" x2="25" y2="11" strokeWidth="2" />
                <line x1="9" y1="16" x2="23" y2="16" strokeWidth="2" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // ── Mobile (≤480px): in-flow circle inside the home hero slot ──
  // Rendered whenever the slot exists and the user hasn't ✕'d it or
  // opened chat — NOT gated on inlineInView, because the circle must
  // stay mounted for the IntersectionObserver to see it re-enter the
  // viewport. Pages without the slot render nothing (pill UX).
  if (isMobile) {
    if (!mounted || !slotEl || hidden || isOpen) return null
    return createPortal(circle('inline'), slotEl)
  }

  // ── Desktop: unchanged fixed-corner behavior ──
  if (showRestoreFab) {
    return (
      <button className="grace-intro-restore" onClick={restoreWidget} aria-label="Open Grace — Ai RCM Representative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/grace-avatar.png" alt="Grace" />
      </button>
    )
  }
  if (!visible) return null
  return circle('fixed')
}
