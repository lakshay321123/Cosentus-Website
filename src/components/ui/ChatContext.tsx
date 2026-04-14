'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface Message {
  role: 'user' | 'bot'
  text: string
}

interface ChatContextType {
  messages: Message[]
  sendMessage: (text: string) => void
  clearMessages: () => void
  isOpen: boolean
  setIsOpen: (v: boolean) => void
  isLoading: boolean
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  sendMessage: () => {},
  clearMessages: () => {},
  isOpen: false,
  setIsOpen: () => {},
  isLoading: false,
})

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (text: string) => {
    const userMsg: Message = { role: 'user', text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      if (!res.ok) throw new Error('API error')

      // Stream the response word-by-word
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No stream')

      const decoder = new TextDecoder()
      let botText = ''
      let buffer = ''

      // Add empty bot message that we'll progressively fill
      setMessages(prev => [...prev, { role: 'bot', text: '' }])

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream: true })

        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const event = JSON.parse(line.slice(6))
            if (event.type === 'text') {
              botText += event.text
              setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'bot', text: botText }
                return updated
              })
            } else if (event.type === 'done' && event.navigate) {
              // Handle navigation
              const nav = event.navigate
              if (nav.route) {
                setTimeout(() => {
                  window.location.href = nav.route + (nav.scroll ? '#' + nav.scroll : '')
                }, 500)
              }
            }
          } catch {}
        }
      }
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "I'm having a brief hiccup. You can reach our team directly at (877) 806-2286 or sales@cosentus.com — they'll take great care of you!"
      }])
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  const clearMessages = () => setMessages([])

  return (
    <ChatContext.Provider value={{ messages, sendMessage, clearMessages, isOpen, setIsOpen, isLoading }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  return useContext(ChatContext)
}
