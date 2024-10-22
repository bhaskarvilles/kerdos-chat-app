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

export type Theme = 'light' | 'dark' | 'system'

export interface UserPreferences {
  fontSize: 'small' | 'medium' | 'large'
  messageDisplay: 'bubbles' | 'flat'
  persistentChats: boolean
  chatHistory: boolean
  maxHistoryDays: number
  theme: Theme
  enableNotifications: boolean
  soundNotifications: boolean
  notificationVolume: number
}

export interface Chat {
  id: string
  name: string
  messages: Message[]
}

export interface AccessibilitySettings {
  fontSize: 'medium' | 'large'
  highContrast: boolean
  reducedMotion: boolean
}
