export interface Message {
  id: number
  content: string
  sender: 'user' | 'ai'
  timestamp: string
  username: string
  room?: string
}

export interface User {
  username: string
  expirationTime: number
}

export interface ChatRoom {
  id: string
  name: string
}

export interface Chatbot {
  id: string
  name: string
  personality: string
}

export interface UserPreferences {
  fontSize: 'medium' | 'large'
  messageDisplay: 'bubbles' | 'flat'
}