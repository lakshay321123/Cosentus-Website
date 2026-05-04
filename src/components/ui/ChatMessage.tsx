'use client'

import { ReactNode, useEffect, useState } from 'react'

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
 * Streaming-aware typewriter for bot messages.
 *
 * `text` grows monotonically as SSE chunks arrive (ChatContext appends each
 * chunk to the last bot message's `text`). `displayedLength` is the number
 * of chars currently revealed; it only ever moves forward. We never reset
 * it on `text` change — that was the bug in the previous COSE typewriter,
 * which used a setInterval keyed on `[text]` so every new SSE chunk wiped
 * the screen and retyped from char 0. cosentus.ai never hit that bug
 * because their backend is a single REST POST — `text` arrives once, the
 * typewriter sees one final value.
 *
 * Speed: 18ms/char base (matches the original COSE feel). Catch-up step
 * accelerates when far behind so a long final chunk doesn't leave the
 * caret crawling for 10+ seconds after the stream completes.
 *
 * Caret blinks while still typing OR while the server is still streaming.
 *
 * @param text       The current accumulated message text from ChatContext.
 * @param streaming  True while SSE is still feeding chunks for this bubble.
 */
export function BotMessage({ text, streaming = false }: { text: string; streaming?: boolean }) {
  const [displayedLength, setDisplayedLength] = useState(0)

  useEffect(() => {
    if (displayedLength >= text.length) return
    const remaining = text.length - displayedLength
    // Catch-up: 1 char/tick when close (~55 cps), accelerate when far behind
    // so a 600-char gap clears in ~1s rather than ~11s.
    const step = Math.max(1, Math.ceil(remaining / 60))
    const t = setTimeout(() => {
      setDisplayedLength(prev => Math.min(prev + step, text.length))
    }, 18)
    return () => clearTimeout(t)
  }, [text, displayedLength])

  const showCaret = displayedLength < text.length || streaming

  return (
    <span style={{ whiteSpace: 'pre-wrap' }}>
      {formatText(text.slice(0, displayedLength))}
      {showCaret && (
        <span style={{ opacity: 0.6, animation: 'blink 0.8s infinite', marginLeft: 1 }}>|</span>
      )}
    </span>
  )
}
