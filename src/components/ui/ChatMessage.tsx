'use client'

import { useState, useEffect, useRef } from 'react'

// Simple markdown-like formatting: **bold**, newlines
function formatText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    // Split by newlines
    const lines = part.split('\n')
    return lines.map((line, j) => (
      <span key={`${i}-${j}`}>
        {j > 0 && <br />}
        {line}
      </span>
    ))
  })
}

export function BotMessage({ text, animate = false }: { text: string; animate?: boolean }) {
  const [displayed, setDisplayed] = useState(animate ? '' : text)
  const [done, setDone] = useState(!animate)
  const idx = useRef(0)

  useEffect(() => {
    if (!animate) {
      setDisplayed(text)
      setDone(true)
      return
    }
    idx.current = 0
    setDisplayed('')
    setDone(false)
    const interval = setInterval(() => {
      idx.current++
      if (idx.current >= text.length) {
        setDisplayed(text)
        setDone(true)
        clearInterval(interval)
      } else {
        setDisplayed(text.slice(0, idx.current))
      }
    }, 18) // 18ms per character = fast but readable
    return () => clearInterval(interval)
  }, [text, animate])

  return (
    <span style={{ whiteSpace: 'pre-wrap' }}>
      {formatText(displayed)}
      {!done && <span style={{ opacity: 0.6, animation: 'blink 0.8s infinite' }}>|</span>}
    </span>
  )
}
