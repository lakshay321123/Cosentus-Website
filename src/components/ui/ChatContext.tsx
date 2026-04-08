'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface Message {
  role: 'user' | 'bot'
  text: string
}

interface ChatContextType {
  messages: Message[]
  addMessage: (msg: Message) => void
  clearMessages: () => void
  isOpen: boolean
  setIsOpen: (v: boolean) => void
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  addMessage: () => {},
  clearMessages: () => {},
  isOpen: false,
  setIsOpen: () => {},
})

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addMessage = (msg: Message) => setMessages(prev => [...prev, msg])
  const clearMessages = () => setMessages([])

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages, isOpen, setIsOpen }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  return useContext(ChatContext)
}
