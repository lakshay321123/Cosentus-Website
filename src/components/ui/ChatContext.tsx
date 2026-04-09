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

      const data = await res.json()
      setMessages(prev => [...prev, { role: 'bot', text: data.text }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: "I'm having a brief hiccup. You can reach our team directly at (877) 806-2286 or wecare@cosentus.com — they'll take great care of you!"
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
