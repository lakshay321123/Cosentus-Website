'use client'

/**
 * MultiLineTyping
 *
 * Types out a series of lines sequentially. Each line types
 * character-by-character; once complete, it stays on screen and the
 * next line begins. A blinking cursor follows the currently-typing
 * line. After all lines finish, the cursor remains at the end of
 * the last line, blinking.
 *
 * Inspired by the 21st.dev typing-effect.tsx spec but materially
 * different: that component cycles a single string through type→
 * erase→retype. This component accumulates lines without erasing,
 * which is the pattern the Cosentus Hero tagline needs.
 *
 * Honors prefers-reduced-motion by rendering all lines instantly
 * without animation.
 *
 * Props:
 *   lines        Array of line strings, in order
 *   typingSpeed  ms per character (default 50)
 *   lineGap      ms pause between completing one line and starting
 *                the next (default 350)
 *   className    Optional extra class on the root container
 *   lineClass    Optional extra class on each rendered line element.
 *                Used by HeroSection to apply font scaling that
 *                matches the previous static h1.
 *   as           Tag for the root element. Defaults to 'h1' so the
 *                Hero usage keeps a single semantic heading.
 *   onComplete   Optional callback fired exactly once when the
 *                typing animation finishes (or immediately if
 *                prefers-reduced-motion is active). Used by
 *                HeroSection to sequence the bottom-row card
 *                entrance animations after the headline is done.
 *
 * Accessibility:
 *   - The full text of all lines is included in a visually-hidden
 *     fallback span so screen readers announce the tagline as one
 *     coherent heading rather than character-by-character.
 *   - aria-hidden is on the typing-out spans.
 */

import { CSSProperties, useEffect, useRef, useState } from 'react'

interface MultiLineTypingProps {
  lines: string[]
  typingSpeed?: number
  lineGap?: number
  className?: string
  lineClass?: string
  as?: 'h1' | 'h2' | 'div'
  style?: CSSProperties
  onComplete?: () => void
}

export default function MultiLineTyping({
  lines,
  typingSpeed = 50,
  lineGap = 350,
  className,
  lineClass,
  as: Tag = 'h1',
  style,
  onComplete,
}: MultiLineTypingProps) {
  // Respect prefers-reduced-motion: render fully typed instantly.
  const [reducedMotion, setReducedMotion] = useState(false)

  // Index of the line currently being typed (0..lines.length).
  // When equal to lines.length, all lines are done.
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  // How many characters of the current line have been revealed.
  const [currentCharCount, setCurrentCharCount] = useState(0)

  // Refs to avoid stale-closure bugs in setTimeout callbacks.
  const lineRef = useRef(0)
  const charRef = useRef(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Track whether onComplete has already fired so we never call it
  // twice — guards against React StrictMode double-invocation in
  // dev and against any future re-render path.
  const completedRef = useRef(false)
  // Stash the latest onComplete in a ref so the typing effect
  // doesn't restart when the parent re-renders with a new closure.
  const onCompleteRef = useRef<(() => void) | undefined>(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // Detect reduced-motion preference. Runs once on mount.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
  }, [])

  // Drive the typing animation.
  useEffect(() => {
    if (reducedMotion) {
      // Skip animation: mark as fully done. Also fire onComplete
      // immediately so consumers don't wait on a typing sequence
      // that never runs.
      setCurrentLineIndex(lines.length)
      setCurrentCharCount(0)
      if (!completedRef.current) {
        completedRef.current = true
        onCompleteRef.current?.()
      }
      return
    }

    function step() {
      const lineIdx = lineRef.current
      const charIdx = charRef.current

      // All lines finished — stop scheduling timers. Cursor keeps
      // blinking via CSS animation on the last line. Fire
      // onComplete once.
      if (lineIdx >= lines.length) {
        if (!completedRef.current) {
          completedRef.current = true
          onCompleteRef.current?.()
        }
        return
      }

      const line = lines[lineIdx]

      if (charIdx < line.length) {
        // Still typing this line: advance one character.
        charRef.current = charIdx + 1
        setCurrentCharCount(charRef.current)
        timeoutRef.current = setTimeout(step, typingSpeed)
      } else {
        // Line complete: pause briefly, then move to next line.
        lineRef.current = lineIdx + 1
        charRef.current = 0
        setCurrentLineIndex(lineRef.current)
        setCurrentCharCount(0)
        if (lineRef.current < lines.length) {
          timeoutRef.current = setTimeout(step, lineGap)
        } else {
          // All lines just finished. Fire onComplete on the next
          // tick so the cursor blink + final line render commit
          // before consumers react.
          if (!completedRef.current) {
            completedRef.current = true
            onCompleteRef.current?.()
          }
        }
      }
    }

    // Kick off.
    timeoutRef.current = setTimeout(step, typingSpeed)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
    // We deliberately don't include `lines` in the deps — this
    // component is built for a static lines prop. If lines were to
    // change mid-flight we'd need a reset effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion])

  // SR-only full text for accessibility (one coherent string).
  const fullText = lines.join(' ')

  return (
    <Tag className={className} style={style}>
      <span
        // Visually hidden but read by screen readers.
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        {fullText}
      </span>

      {/* Visual rendering — aria-hidden so screen readers don't
          stutter on the in-progress text. */}
      <span aria-hidden="true" style={{ display: 'block' }}>
        {lines.map((line, idx) => {
          const isPastLine = idx < currentLineIndex
          const isCurrentLine = idx === currentLineIndex
          const isFutureLine = idx > currentLineIndex

          // Past lines: render in full.
          // Current line: render slice based on charCount.
          // Future lines: render nothing yet — but reserve vertical
          //   space so the layout doesn't jump as lines appear. The
          //   easiest way to reserve space is to render a
          //   non-breaking space inside the same line container.
          let content: string
          if (isPastLine) content = line
          else if (isCurrentLine) content = line.slice(0, currentCharCount)
          else content = '\u00A0' // non-breaking space, reserves line height

          const showCursor = isCurrentLine && !reducedMotion
          // If reducedMotion, show cursor on the last line forever.
          const showCursorOnLast =
            reducedMotion && idx === lines.length - 1

          return (
            <span
              key={idx}
              className={lineClass}
              style={{ display: 'block' }}
            >
              {isFutureLine && !reducedMotion ? (
                // Reserve line height with an invisible non-breaking
                // space. We could omit but the layout would shift
                // upward as each line completes.
                <span style={{ visibility: 'hidden' }}>{line}</span>
              ) : (
                content
              )}
              {(showCursor || showCursorOnLast) && (
                <span
                  className="mlt-cursor"
                  aria-hidden="true"
                />
              )}
            </span>
          )
        })}
      </span>

      <style>{`
        .mlt-cursor {
          display: inline-block;
          width: 0.08em;
          height: 0.95em;
          margin-left: 0.08em;
          background: currentColor;
          vertical-align: -0.12em;
          animation: mlt-blink 0.9s steps(1, end) infinite;
        }
        @keyframes mlt-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mlt-cursor {
            animation: none;
            opacity: 1;
          }
        }
      `}</style>
    </Tag>
  )
}
