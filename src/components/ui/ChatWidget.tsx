'use client'

import { useRef, useState, useEffect } from 'react'
import { useChat } from './ChatContext'
import { BotMessage } from './ChatMessage'

function VoiceWave({ active }: { active: boolean }) {
  return (
    <div className="voice-wave" style={{ display: 'flex', alignItems: 'center', gap: 3, height: 24 }}>
      {[0, 1, 2, 3, 4, 5, 6].map(i => (
        <div
          key={i}
          style={{
            width: 3,
            borderRadius: 2,
            background: active ? '#00B5D6' : '#CCCCCC',
            transition: 'background 0.3s',
            animation: active ? `voiceBar 0.8s ease-in-out ${i * 0.08}s infinite alternate` : 'none',
            height: active ? undefined : 4,
          }}
        />
      ))}
    </div>
  )
}

export default function ChatWidget() {
  const { messages, sendMessage, isOpen, setIsOpen, isLoading, showWelcome, setShowWelcome } = useChat()
  const [input, setInput] = useState('')
  const [minimized, setMinimized] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [welcomeVisible, setWelcomeVisible] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  // Show welcome popup after 2s delay
  useEffect(() => {
    if (showWelcome && !isOpen) {
      const timer = setTimeout(() => setWelcomeVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [showWelcome, isOpen])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (isOpen && !minimized) setTimeout(() => inputRef.current?.focus(), 200)
  }, [isOpen, minimized])

  const handleSend = () => {
    if (!input.trim() || isLoading) return
    sendMessage(input)
    setInput('')
  }

  const startChat = () => {
    setShowWelcome(false)
    setWelcomeVisible(false)
    setIsOpen(true)
    setMinimized(false)
  }

  const dismissWelcome = () => {
    setShowWelcome(false)
    setWelcomeVisible(false)
  }

  const hasConversation = messages.length > 0

  // ===== FAB + WELCOME POPUP (closed state) =====
  if (!isOpen) {
    return (
      <>
        {/* Welcome popup */}
        {welcomeVisible && (
          <div className="cindy-welcome">
            <button className="cindy-welcome-close" onClick={dismissWelcome}>✕</button>
            <img src="/images/cindy.png" alt="Cindy" className="cindy-welcome-avatar" />
            <div className="cindy-welcome-name">Cindy — AI Guide</div>
            <p className="cindy-welcome-text">
              Hi! I&apos;m <strong>Cindy</strong>, your AI voice guide. I can navigate this website and answer any questions. Ready?
            </p>
            <button className="cindy-welcome-start" onClick={startChat}>
              Start Conversation
            </button>
            <button className="cindy-welcome-later" onClick={dismissWelcome}>
              Later
            </button>
          </div>
        )}

        {/* FAB button */}
        <button
          onClick={welcomeVisible ? startChat : () => { setIsOpen(true); setMinimized(false) }}
          aria-label="Chat with Cindy"
          className="chat-fab"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
          {hasConversation && (
            <span className="chat-fab-badge">{messages.filter(m => m.role === 'bot').length}</span>
          )}
        </button>
      </>
    )
  }

  // ===== MOBILE MINIMIZED BAR =====
  if (isMobile && minimized) {
    return (
      <div className="chat-mini-bar" onClick={() => setMinimized(false)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
          <div className="chat-mini-avatar">C</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>Cindy — AI Guide</div>
            <div style={{ fontSize: 11, color: '#616161' }}>
              {isLoading ? 'Typing...' : 'Tap to expand'}
            </div>
          </div>
        </div>
        <VoiceWave active={isLoading} />
        <button
          onClick={(e) => { e.stopPropagation(); setIsOpen(false); setMinimized(false) }}
          className="chat-mini-close"
        >✕</button>
      </div>
    )
  }

  // ===== FULL CHAT PANEL =====
  return (
    <div className={`chat-widget ${isMobile ? 'chat-mobile' : ''}`}>
      {/* Header */}
      <div className="chat-header">
        <div>
          <h4 style={{ fontSize: 15, fontWeight: 600, color: 'white', margin: 0 }}>Cindy — AI Guide</h4>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)', margin: 0 }}>Revenue Intelligence Assistant</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {isMobile && hasConversation && (
            <button
              onClick={() => setMinimized(true)}
              className="chat-header-btn"
              aria-label="Minimize"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>
          )}
          <button onClick={() => { setIsOpen(false); setMinimized(false) }} className="chat-header-btn">✕</button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        <div className="chat-bubble chat-bot">
          Hey! I&apos;m Cindy, your AI guide. How can I help you today?
        </div>
        {messages.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.role === 'user' ? 'chat-user' : 'chat-bot'}`}>
            {msg.role === 'bot' ? (
              <BotMessage text={msg.text} animate={i === messages.length - 1} />
            ) : msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="chat-bubble chat-bot" style={{ display: 'flex', gap: 4, alignItems: 'center', padding: '14px 18px' }}>
            <VoiceWave active={true} />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chat-input-area">
        <div className="chat-input-row">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="chat-input"
          />
          <button onClick={handleSend} disabled={isLoading} className="chat-send-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
