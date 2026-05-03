'use client'

import { ReactNode } from 'react'

/**
 * Render `**bold**` and newlines.
 * Mirrors the formatting cosentus.ai's renderMarkdown produces for the
 * subset we actually emit from the system prompt — bold and line breaks.
 */
function formatText(text: string): ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    const lines = part.split('\n')
    return (
      <span key={i}>
        {lines.map((line, j) => (
          <span key={j}>
            {j > 0 && <br />}
            {line}
          </span>
        ))}
      </span>
    )
  })
}

/**
 * Renders a bot message.
 *
 * IMPORTANT: there is NO client-side typewriter. The server already streams
 * text via SSE (`/api/chat`) — each chunk arrives, ChatContext appends it to
 * the message's `text`, and React renders it. That natural drip-feed IS the
 * typewriter effect.
 *
 * The previous implementation ran a second typewriter on top, which RESET to
 * empty and retyped from scratch on every prop change. With streaming text
 * that meant a wipe-and-retype on every SSE chunk — visible jitter the user
 * (correctly) called "buggy while typing." cosentus.ai never hit this bug
 * because their backend is a single REST POST, not a stream — the typewriter
 * only sees one final `text` value.
 *
 * @param streaming  When true, append a blinking caret to signal active typing.
 */
export function BotMessage({ text, streaming = false }: { text: string; streaming?: boolean }) {
  return (
    <span style={{ whiteSpace: 'pre-wrap' }}>
      {formatText(text)}
      {streaming && (
        <span style={{ opacity: 0.6, animation: 'blink 0.8s infinite', marginLeft: 1 }}>|</span>
      )}
    </span>
  )
}
