'use client'

import { ReactNode, useEffect, useState } from 'react'

/* ──────────────────────────────────────────────────────────────────────
 * Inline tokenizer
 *
 * Single regex pass that splits a line into bold | markdown-link |
 * bare-url | plain-text segments. Single pass = no order-of-operations
 * bugs (e.g. a URL inside a bold segment is handled because the bold
 * regex matches first; a URL outside any markdown is auto-linkified).
 *
 * Patterns (in priority order, encoded by alternation order in the regex):
 *   1. **bold**
 *   2. [link text](https://example.com) — markdown link
 *   3. https://example.com or http://example.com — bare URL
 *
 * Anything that doesn't match falls through as plain text.
 * ────────────────────────────────────────────────────────────────────── */

const INLINE_TOKEN = /(\*\*[^*]+\*\*)|(\[[^\]]+\]\((?:https?:\/\/)[^)\s]+\))|((?:https?:\/\/)[^\s)]+)/g

function formatInline(text: string): ReactNode[] {
  if (!text) return []
  const out: ReactNode[] = []
  let lastIndex = 0
  let key = 0

  for (const m of Array.from(text.matchAll(INLINE_TOKEN))) {
    const start = m.index ?? 0
    if (start > lastIndex) {
      out.push(text.slice(lastIndex, start))
    }

    const [full, bold, mdLink, bareUrl] = m

    if (bold) {
      out.push(
        <strong key={key++} style={{ fontWeight: 600, color: '#ffffff' }}>
          {bold.slice(2, -2)}
        </strong>
      )
    } else if (mdLink) {
      // [text](url)
      const labelEnd = mdLink.indexOf(']')
      const label = mdLink.slice(1, labelEnd)
      const url = mdLink.slice(labelEnd + 2, -1)
      out.push(<MarkdownLink key={key++} href={url}>{label}</MarkdownLink>)
    } else if (bareUrl) {
      // Trim trailing punctuation that's almost certainly sentence-ending
      // rather than part of the URL: . , ; : ! ?
      const trimmed = bareUrl.replace(/[.,;:!?]+$/, '')
      const trailing = bareUrl.slice(trimmed.length)
      out.push(<MarkdownLink key={key++} href={trimmed}>{trimmed}</MarkdownLink>)
      if (trailing) out.push(trailing)
    }

    lastIndex = start + full.length
  }

  if (lastIndex < text.length) {
    out.push(text.slice(lastIndex))
  }

  return out
}

function MarkdownLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        color: '#68D1E6',
        textDecoration: 'underline',
        textDecorationColor: 'rgba(104, 209, 230, 0.45)',
        textUnderlineOffset: 2,
        wordBreak: 'break-word',
      }}
    >
      {children}
    </a>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 * Block parser
 *
 * Splits text by '\n', classifies each line into a block type. Empty
 * lines are dropped — natural spacing between blocks comes from each
 * block's own margins, not from blank-line paragraphs.
 *
 * Streaming behavior: we re-parse on every render. Partial text during
 * typewriter just renders fewer / shorter blocks; transitions like
 * "Heading\n- Bul" → "Heading\n- Bullet" cause the bullet block's
 * content to grow in place. No flicker.
 * ────────────────────────────────────────────────────────────────────── */

type BlockType = 'h2' | 'h3' | 'bullet' | 'number' | 'p'

interface Block {
  type: BlockType
  content: string
  num?: string  // for numbered list
}

function parseBlocks(text: string): Block[] {
  if (!text) return []
  const lines = text.split('\n')
  const blocks: Block[] = []

  for (const line of lines) {
    if (!line.trim()) continue

    if (line.startsWith('## ')) {
      blocks.push({ type: 'h2', content: line.slice(3) })
    } else if (line.startsWith('### ')) {
      blocks.push({ type: 'h3', content: line.slice(4) })
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      blocks.push({ type: 'bullet', content: line.slice(2) })
    } else {
      const numMatch = line.match(/^(\d+)\.\s(.*)$/)
      if (numMatch) {
        blocks.push({ type: 'number', content: numMatch[2], num: numMatch[1] })
      } else {
        blocks.push({ type: 'p', content: line })
      }
    }
  }

  return blocks
}

/* ──────────────────────────────────────────────────────────────────────
 * Block renderer
 *
 * Each block is rendered with inline styles — keeps everything local to
 * this file, no styled-jsx scope leakage into ChatWidget. Caret is
 * appended inline after the LAST block's content so it sits at the
 * typing position, not on a fresh line below.
 * ────────────────────────────────────────────────────────────────────── */

const ACCENT = '#68D1E6'        // softer cyan, readable on dark bubble
const STRONG = '#ffffff'        // bright white for emphasis on dark

function renderBlock(b: Block, isLast: boolean, showCaret: boolean, key: number): ReactNode {
  const inline = formatInline(b.content)
  const caret = isLast && showCaret ? <Caret /> : null

  switch (b.type) {
    case 'h2':
      return (
        <div key={key} style={{
          fontWeight: 700,
          color: STRONG,
          marginTop: key === 0 ? 0 : 8,
          marginBottom: 4,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          lineHeight: 1.4,
        }}>
          {inline}{caret}
        </div>
      )
    case 'h3':
      return (
        <div key={key} style={{
          fontWeight: 600,
          color: STRONG,
          marginTop: key === 0 ? 0 : 6,
          marginBottom: 3,
          lineHeight: 1.4,
        }}>
          {inline}{caret}
        </div>
      )
    case 'bullet':
      return (
        <div key={key} style={{
          display: 'flex',
          gap: 8,
          marginTop: key === 0 ? 0 : 3,
          marginBottom: 3,
          lineHeight: 1.45,
        }}>
          <span style={{ color: ACCENT, flexShrink: 0, lineHeight: 1.45 }}>•</span>
          <span style={{ flex: 1, minWidth: 0 }}>{inline}{caret}</span>
        </div>
      )
    case 'number':
      return (
        <div key={key} style={{
          display: 'flex',
          gap: 8,
          marginTop: key === 0 ? 0 : 3,
          marginBottom: 3,
          lineHeight: 1.45,
        }}>
          <span style={{
            color: ACCENT,
            fontWeight: 600,
            flexShrink: 0,
            lineHeight: 1.45,
            minWidth: 14,
          }}>{b.num}.</span>
          <span style={{ flex: 1, minWidth: 0 }}>{inline}{caret}</span>
        </div>
      )
    case 'p':
    default:
      return (
        <div key={key} style={{
          marginTop: key === 0 ? 0 : 4,
          marginBottom: 0,
          lineHeight: 1.45,
        }}>
          {inline}{caret}
        </div>
      )
  }
}

function Caret() {
  return (
    <span
      aria-hidden="true"
      style={{
        opacity: 0.6,
        animation: 'blink 0.8s infinite',
        marginLeft: 1,
      }}
    >
      |
    </span>
  )
}

/* ──────────────────────────────────────────────────────────────────────
 * BotMessage — streaming-aware typewriter wrapping the markdown renderer
 *
 * `text` grows monotonically as SSE chunks arrive (ChatContext appends
 * each chunk). `displayedLength` advances via setTimeout toward
 * text.length and never resets — that was the bug in the previous COSE
 * typewriter (resetting on every text change wiped the screen on every
 * SSE chunk). Catch-up step accelerates when far behind so a long final
 * chunk doesn't leave the caret crawling for many seconds.
 *
 * Caret is shown while the typewriter is still catching up OR while the
 * server is still streaming.
 * ────────────────────────────────────────────────────────────────────── */

export function BotMessage({ text, streaming = false }: { text: string; streaming?: boolean }) {
  const [displayedLength, setDisplayedLength] = useState(0)

  useEffect(() => {
    if (displayedLength >= text.length) return
    const remaining = text.length - displayedLength
    const step = Math.max(1, Math.ceil(remaining / 60))
    const t = setTimeout(() => {
      setDisplayedLength(prev => Math.min(prev + step, text.length))
    }, 18)
    return () => clearTimeout(t)
  }, [text, displayedLength])

  const visible = text.slice(0, displayedLength)
  const showCaret = displayedLength < text.length || streaming
  const blocks = parseBlocks(visible)

  // Empty state during streaming: just the caret (so the bubble isn't
  // collapsed to nothing while we wait for the first chunk to land).
  if (blocks.length === 0) {
    return showCaret ? (
      <span style={{ whiteSpace: 'pre-wrap' }}><Caret /></span>
    ) : null
  }

  return (
    <div style={{ whiteSpace: 'normal' }}>
      {blocks.map((b, i) => renderBlock(b, i === blocks.length - 1, showCaret, i))}
    </div>
  )
}
