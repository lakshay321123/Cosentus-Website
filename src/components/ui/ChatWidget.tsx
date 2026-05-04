'use client'

import { useRef, useState, useEffect } from 'react'
import { useChat } from './ChatContext'
import { BotMessage } from './ChatMessage'

/**
 * Suggestion chips shown in the empty/welcome state.
 * Verbatim copy from cosentus.ai (CHAT_SUGGESTIONS, app.jsx:126).
 */
const CHAT_SUGGESTIONS = [
  'How much revenue is my practice missing today?',
  "What's causing delays, denials, or write-offs in my revenue cycle?",
  'How can Cosentus improve collections without adding staff or risk?',
  'My A/R is through the roof — what are the most common causes?',
  'Why are my denials increasing — and what should I look at first?',
  "I think we're getting underpaid by payers — how do I know?",
  'How can we improve patient payments without upsetting patients?',
  "Our clean claim rate is dropping — what's causing it, and how do we fix it fast?",
]

export default function ChatWidget() {
  const { messages, sendMessage, isOpen, setIsOpen, isLoading } = useChat()
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on every chunk arrival. We key on cumulative char
  // count across all messages so each SSE chunk that grows the last message's
  // text triggers a scroll, not just message count changes.
  const totalChars = messages.reduce((n, m) => n + m.text.length, 0)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [totalChars, isLoading])

  // Auto-focus input on open — desktop only. Mobile would pop the keyboard.
  useEffect(() => {
    if (!isOpen) return
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches) return
    setTimeout(() => inputRef.current?.focus(), 200)
  }, [isOpen])

  // Mobile keyboard handling — sets CSS vars used by the @media block to keep
  // the chat panel above the on-screen keyboard (iMessage-style).
  useEffect(() => {
    if (typeof window === 'undefined') return
    const vv = window.visualViewport
    if (!vv) return
    const update = () => {
      document.documentElement.style.setProperty('--chat-vh', `${vv.height}px`)
      const bottomOffset = Math.max(0, window.innerHeight - vv.height - vv.offsetTop)
      document.documentElement.style.setProperty('--chat-kb', `${bottomOffset}px`)
    }
    vv.addEventListener('resize', update)
    vv.addEventListener('scroll', update)
    update()
    return () => {
      vv.removeEventListener('resize', update)
      vv.removeEventListener('scroll', update)
    }
  }, [])

  // Esc closes the panel.
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, setIsOpen])

  const handleSend = (overrideText?: string) => {
    const text = (overrideText ?? input).trim()
    if (!text || isLoading) return
    sendMessage(text)
    setInput('')
  }

  const showWelcome = messages.length === 0 && !isLoading

  return (
    <>
      {/* Floating bubble — closed state */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open chat with Grace"
          className="grace-fab"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          {messages.length > 0 && (
            <span className="grace-fab-badge">
              {messages.filter(m => m.role === 'bot').length}
            </span>
          )}
        </button>
      )}

      {/* Open panel — Grace dark-glass UI */}
      {isOpen && (
        <div className="grace-panel" role="dialog" aria-label="Chat with Grace">
          {/* Header */}
          <div className="grace-header">
            <div className="grace-header-left">
              <div className="grace-avatar">
                <img src="/images/grace-avatar.png" alt="Grace" />
                <span className="grace-status-dot" />
              </div>
              <div className="grace-titles">
                <div className="grace-name">Grace</div>
                <div className="grace-tag">Cosentus Ai Representative</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
              className="grace-close"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className="grace-body" ref={scrollRef}>
            {showWelcome && (
              <div className="grace-welcome">
                <div className="grace-welcome-text">
                  Hi, I&apos;m Grace. Ask me anything about your revenue cycle — or pick a question to get started.
                </div>
                <div className="grace-suggest-grid">
                  {CHAT_SUGGESTIONS.map((s, i) => (
                    <button
                      key={s}
                      type="button"
                      className="grace-suggest-chip"
                      style={{ animationDelay: `${0.45 + i * 0.1}s` }}
                      onClick={() => handleSend(s)}
                    >
                      <span>{s}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`grace-msg ${msg.role === 'user' ? 'user' : 'ai'}`}>
                <div className="grace-msg-bubble">
                  {msg.role === 'bot' ? (
                    <BotMessage text={msg.text} streaming={isLoading && i === messages.length - 1} />
                  ) : msg.text}
                </div>
              </div>
            ))}

            {/* Typing dots only show before the bot bubble exists — once
                ChatContext appends the empty bot message and SSE chunks
                begin to arrive, the BotMessage's streaming caret takes
                over. Prevents two simultaneous "AI is typing" indicators. */}
            {isLoading && messages[messages.length - 1]?.role !== 'bot' && (
              <div className="grace-msg ai">
                <div className="grace-msg-bubble grace-typing">
                  <span className="grace-typing-dot" />
                  <span className="grace-typing-dot" />
                  <span className="grace-typing-dot" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="grace-input-row">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                // Ignore Enter while an IME (Japanese/Chinese/Korean) is
                // mid-composition — submitting then sends partial text.
                // React's SyntheticKeyboardEvent types vary on `isComposing`
                // across versions; nativeEvent.isComposing is always present.
                if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSend()
              }}
              placeholder="Type your message…"
              aria-label="Type your message"
              className="grace-input"
            />
            <button
              type="button"
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              aria-label="Send"
              className="grace-send"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        /* ===== Floating action button ===== */
        .grace-fab {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #00B5D6;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 4px 24px rgba(0, 181, 214, 0.4),
            0 8px 40px rgba(0, 0, 0, 0.15);
          transition: transform 0.18s ease, box-shadow 0.25s ease;
        }
        .grace-fab:hover {
          transform: scale(1.06);
          box-shadow:
            0 6px 28px rgba(0, 181, 214, 0.55),
            0 10px 44px rgba(0, 0, 0, 0.2);
        }
        .grace-fab-badge {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          color: #00B5D6;
          font-size: 11px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* ===== Open panel — dark glass ===== */
        .grace-panel {
          position: fixed;
          bottom: 28px;
          right: 28px;
          z-index: 9999;
          width: 400px;
          height: 580px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          background: rgba(8, 18, 30, 0.78);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border: 1px solid rgba(104, 209, 230, 0.28);
          border-radius: 24px;
          box-shadow:
            0 24px 80px -16px rgba(0, 0, 0, 0.7),
            0 0 80px rgba(0, 181, 214, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          animation: graceExpand 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          font-family: var(--font-body, system-ui, -apple-system, sans-serif);
        }
        @keyframes graceExpand {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* ===== Header ===== */
        .grace-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(104, 209, 230, 0.14);
          background: linear-gradient(180deg, rgba(0, 181, 214, 0.06), transparent);
          flex-shrink: 0;
        }
        .grace-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;
        }
        .grace-avatar {
          position: relative;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
        }
        .grace-avatar img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
          display: block;
          border: 1px solid rgba(104, 209, 230, 0.35);
        }
        .grace-status-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 11px;
          height: 11px;
          border: 2px solid #0a1422;
          border-radius: 50%;
          background: #22e07a;
          box-shadow: 0 0 6px rgba(34, 224, 122, 0.8);
          animation: graceStatusPulse 2.4s ease-in-out infinite;
        }
        @keyframes graceStatusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
        .grace-titles {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .grace-name {
          font-weight: 600;
          font-size: 14.5px;
          color: rgba(232, 246, 251, 0.95);
          letter-spacing: 0.1px;
          line-height: 1.2;
        }
        .grace-tag {
          font-size: 11.5px;
          color: rgba(232, 246, 251, 0.7);
          margin-top: 2px;
        }
        .grace-close {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(232, 246, 251, 0.85);
          transition: background 0.18s ease, color 0.18s ease;
        }
        .grace-close:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
        }

        /* ===== Body / message stack ===== */
        .grace-body {
          flex: 1;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 18px 18px 14px;
          scrollbar-width: thin;
          scrollbar-color: rgba(104, 209, 230, 0.3) transparent;
        }
        .grace-body::-webkit-scrollbar { width: 6px; }
        .grace-body::-webkit-scrollbar-thumb {
          background: rgba(104, 209, 230, 0.25);
          border-radius: 3px;
        }
        .grace-body::-webkit-scrollbar-thumb:hover {
          background: rgba(104, 209, 230, 0.45);
        }

        /* ===== Welcome / suggestion chips ===== */
        .grace-welcome {
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: graceFade 0.6s ease 0.1s both;
        }
        @keyframes graceFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .grace-welcome-text {
          color: rgba(232, 246, 251, 0.85);
          font-size: 13.5px;
          line-height: 1.5;
          padding: 0 2px;
        }
        .grace-suggest-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .grace-suggest-chip {
          appearance: none;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(40, 52, 68, 0.7);
          color: rgba(232, 246, 251, 0.9);
          font-family: inherit;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.35;
          letter-spacing: 0.1px;
          padding: 12px;
          border-radius: 14px;
          cursor: pointer;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          transition: border-color 0.2s ease, background 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          text-align: left;
          display: flex;
          align-items: flex-start;
          gap: 6px;
          min-height: 64px;
          animation: graceChipRise 0.55s cubic-bezier(0.22, 1, 0.36, 1) backwards;
        }
        .grace-suggest-chip > span {
          display: block;
          text-wrap: pretty;
        }
        .grace-suggest-chip:hover {
          border-color: rgba(104, 209, 230, 0.5);
          background: rgba(60, 78, 100, 0.85);
          color: #fff;
          transform: translateY(-2px);
          box-shadow: 0 10px 24px -10px rgba(0, 181, 214, 0.45);
        }
        .grace-suggest-chip:active {
          transform: translateY(0);
          transition-duration: 0.08s;
        }
        @keyframes graceChipRise {
          0%   { opacity: 0; transform: translateY(14px) scale(0.96); filter: blur(4px); }
          60%  { filter: blur(0); }
          100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        /* ===== Message bubbles (iMessage-style) ===== */
        .grace-msg {
          display: flex;
          width: 100%;
          animation: graceMsgIn 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .grace-msg.user { justify-content: flex-end; }
        .grace-msg.ai { justify-content: flex-start; }
        @keyframes graceMsgIn {
          from { opacity: 0; transform: translateY(10px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .grace-msg-bubble {
          max-width: 76%;
          padding: 10px 14px;
          border-radius: 20px;
          font-size: 14.5px;
          line-height: 1.45;
          word-wrap: break-word;
          white-space: pre-wrap;
        }
        .grace-msg.user .grace-msg-bubble {
          background: #00B5D6;
          color: #fff;
          border-bottom-right-radius: 6px;
          box-shadow: 0 2px 10px -2px rgba(0, 181, 214, 0.5);
          font-weight: 400;
        }
        .grace-msg.ai .grace-msg-bubble {
          background: rgba(40, 52, 68, 0.95);
          color: rgba(232, 246, 251, 0.95);
          border-bottom-left-radius: 6px;
        }

        /* ===== Typing indicator ===== */
        .grace-typing {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 14px 18px;
        }
        .grace-typing-dot {
          width: 7px;
          height: 7px;
          background: rgba(104, 209, 230, 0.7);
          border-radius: 50%;
          animation: graceTypingBob 1.2s ease-in-out infinite;
        }
        .grace-typing-dot:nth-child(2) { animation-delay: 0.15s; }
        .grace-typing-dot:nth-child(3) { animation-delay: 0.3s; }
        @keyframes graceTypingBob {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
          30% { transform: translateY(-5px); opacity: 1; }
        }

        /* ===== Input row ===== */
        .grace-input-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          border-top: 1px solid rgba(104, 209, 230, 0.16);
          background: transparent;
          flex-shrink: 0;
        }
        .grace-input {
          flex: 1;
          min-width: 0;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(104, 209, 230, 0.18);
          color: #fff;
          font-family: inherit;
          font-size: 14px;
          padding: 10px 14px;
          border-radius: 999px;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .grace-input::placeholder {
          color: rgba(232, 246, 251, 0.45);
        }
        .grace-input:focus {
          border-color: rgba(104, 209, 230, 0.55);
          background: rgba(255, 255, 255, 0.06);
        }
        .grace-send {
          width: 40px;
          height: 40px;
          border-radius: 999px;
          border: none;
          background: linear-gradient(180deg, #36C2DE, #00B5D6);
          color: #001018;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          box-shadow: 0 0 24px rgba(0, 181, 214, 0.45);
          transition: transform 0.18s ease, filter 0.18s ease, opacity 0.18s ease;
        }
        .grace-send:hover:not(:disabled) {
          filter: brightness(1.1);
          transform: scale(1.06);
        }
        .grace-send:active:not(:disabled) {
          transform: scale(0.92);
          transition-duration: 0.08s;
        }
        .grace-send:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          box-shadow: none;
        }

        /* ===== Mobile ===== */
        @media (max-width: 640px) {
          .grace-panel {
            bottom: calc(var(--chat-kb, 0px) + 8px);
            right: 8px;
            left: 8px;
            top: auto;
            width: auto;
            height: calc(var(--chat-vh, 100dvh) - 16px);
            max-height: calc(var(--chat-vh, 100dvh) - 16px);
            border-radius: 20px;
          }
          .grace-name { font-size: 17px; }
          .grace-tag { font-size: 13px; }
          .grace-welcome-text { font-size: 15px; line-height: 1.5; }
          .grace-msg-bubble {
            font-size: 16.5px;
            line-height: 1.5;
            padding: 12px 16px;
            max-width: 86%;
          }
          .grace-suggest-grid { grid-template-columns: 1fr; }
          .grace-suggest-chip { font-size: 14px; min-height: 56px; padding: 13px 14px; }
          .grace-input { font-size: 16px; }
          .grace-send { width: 44px; height: 44px; }
        }
      `}</style>
    </>
  )
}
