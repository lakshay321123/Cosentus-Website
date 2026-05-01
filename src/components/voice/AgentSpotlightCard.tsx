'use client'

/**
 * AgentSpotlightCard
 * ------------------
 * Reusable card for specialty pages that feature a single agent
 * (Anesthesia/ASC → Priya, Orthopedics/Pain → Paige). Wraps the
 * existing 280px portrait card design with click-to-open voice
 * modal behavior — same UX as homepage and Technology page.
 *
 * Self-contained client component. Server pages (pain-management,
 * asc) can use this without adding 'use client' to their own
 * page.tsx (which would break metadata export).
 *
 * Looks up the agent by name from the shared AGENTS data, so the
 * voice call uses the correct Retell agentId + greeting.
 */

import { useState } from 'react'
import VoiceCallModal from '@/components/voice/VoiceCallModal'
import { AGENTS } from '@/data/voice-agents'

interface Props {
  agentName: string             // 'Priya', 'Paige', etc — must match AGENTS[].name
  imgAlt: string                // existing alt text from the page
  roleLabel: string             // small text under name in footer strip
                                // (e.g. 'Prior Auth Tracking Specialist')
}

export default function AgentSpotlightCard({ agentName, imgAlt, roleLabel }: Props) {
  const agent = AGENTS.find(a => a.name === agentName)
  const [open, setOpen] = useState(false)

  // Defensive: if name typo, render a non-clickable placeholder rather
  // than crashing. AGENTS is the source of truth — this should never
  // happen if the calling page passes a valid name.
  if (!agent) {
    return (
      <div style={{ width: 280, padding: 20, textAlign: 'center', color: 'var(--gray-500)' }}>
        Agent &quot;{agentName}&quot; not found
      </div>
    )
  }

  return (
    <>
      {open && <VoiceCallModal agent={agent} onClose={() => setOpen(false)} />}
      <div
        role="button"
        tabIndex={0}
        aria-label={`Talk to ${agent.name}, ${roleLabel}`}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen(true)
          }
        }}
        className="emily-card"  /* keep existing class so any existing CSS still applies */
        style={{
          width: 280,
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid var(--gray-200)',
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          cursor: 'pointer',
          outline: 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-6px)'
          e.currentTarget.style.boxShadow = '0 16px 40px rgba(0, 181, 214, 0.25)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
        <div style={{ height: 300, overflow: 'hidden', background: '#f5f9fa', position: 'relative' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/${agent.img}`}
            alt={imgAlt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
          />
          {/* Subtle "click to talk" hint — small badge top-right with phone icon */}
          <div style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(0, 181, 214, 0.95)',
            color: 'white',
            borderRadius: 999,
            padding: '6px 12px 6px 8px',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 12px rgba(0, 181, 214, 0.3)',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            Talk to {agent.name}
          </div>
        </div>
        <div style={{ background: '#00B5D6', padding: '16px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'white', letterSpacing: '0.03em' }}>{agent.name}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>{roleLabel}</div>
        </div>
      </div>
    </>
  )
}
