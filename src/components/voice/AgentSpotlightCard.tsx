'use client'

/**
 * AgentSpotlightCard
 * ------------------
 * Reusable card for specialty pages that feature a single agent
 * (Anesthesia/ASC → Priya, Orthopedics/Pain → Paige). Click opens
 * VoiceCallModal — same UX as homepage and Technology page.
 *
 * Design — circular avatar matching the homepage R+A grid style.
 * Per Lakshay May 2026: 'It needs to be circular, and I made that
 * clear on every page. You still haven't updated the design.'
 *
 *   - 280px circle (bigger than homepage 120px since this is a
 *     spotlight, not a grid item)
 *   - 4px brand-teal ring + soft brand-blue glow shadow
 *   - Hover lift + intensified glow
 *   - Bold 22px name + 14px medium-weight role underneath
 *   - No 'TALK TO PAIGE' badge — Lakshay flagged it as cluttered
 *     ('please remove the Talk to Page section, which is stupid')
 *
 * Self-contained client component — server pages (pain-management,
 * asc) can use this without converting their metadata exports.
 */

import { useState } from 'react'
import VoiceCallModal from '@/components/voice/VoiceCallModal'
import { AGENTS } from '@/data/voice-agents'

interface Props {
  agentName: string             // 'Priya', 'Paige', etc — must match AGENTS[].name
  imgAlt: string                // existing alt text from the page
  roleLabel: string             // small text under name (e.g. 'Prior Auth Tracking Specialist')
}

export default function AgentSpotlightCard({ agentName, imgAlt, roleLabel }: Props) {
  const agent = AGENTS.find(a => a.name === agentName)
  const [open, setOpen] = useState(false)

  // Defensive: if name typo, render a non-clickable placeholder rather
  // than crashing. AGENTS is the source of truth.
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
        className="agent-spotlight-circle"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          outline: 'none',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-6px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        {/* Circle wrapper — has the brand ring + glow shadow.
            Larger than homepage (280 vs 120) because spotlight is featured. */}
        <div
          className="agent-spotlight-circle-img"
          style={{
            width: 280,
            height: 280,
            borderRadius: '50%',
            overflow: 'hidden',
            background: '#f5f9fa',
            border: '4px solid #00B5D6',
            boxShadow: '0 12px 40px rgba(0, 181, 214, 0.25), 0 4px 12px rgba(0, 181, 214, 0.12)',
            marginBottom: 24,
            flexShrink: 0,
            transition: 'box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/${agent.img}`}
            alt={imgAlt}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 15%' }}
          />
        </div>
        {/* Name — bold, matches homepage typography */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontWeight: 700,
          color: 'var(--gray-900)',
          letterSpacing: '0.01em',
          lineHeight: 1.2,
        }}>
          {agent.name}
        </div>
        {/* Role — medium weight, lighter than name */}
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: 14,
          fontWeight: 500,
          color: 'var(--gray-700)',
          marginTop: 6,
          lineHeight: 1.3,
          letterSpacing: '0.01em',
        }}>
          {roleLabel}
        </div>
      </div>

      {/* Intensify glow on hover via CSS so transition applies properly */}
      <style>{`
        .agent-spotlight-circle:hover .agent-spotlight-circle-img {
          box-shadow: 0 20px 56px rgba(0, 181, 214, 0.40), 0 6px 20px rgba(0, 181, 214, 0.20);
        }
        @media (max-width: 700px) {
          .agent-spotlight-circle-img {
            width: 220px !important;
            height: 220px !important;
          }
        }
      `}</style>
    </>
  )
}
