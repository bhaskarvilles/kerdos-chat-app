export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  username: string;
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
  fontSize: string;
  messageDisplay: string;
  persistentChats: boolean;
  chatHistory: boolean;
  maxHistoryDays: number;
  theme: 'light' | 'dark';
  enableNotifications: boolean;
  soundNotifications: boolean;
  notificationVolume: number;
}

export interface Chat {
  id: string
  name: string
  messages: Message[]
  // ... any other properties
}

export interface AccessibilitySettings {
  fontSize: 'medium' | 'large'
  highContrast: boolean
  reducedMotion: boolean
}

// Add proper component prop interfaces
interface SidebarProps {
  // ... existing props
  className?: string; // Add optional className prop
}

interface ChatWindowProps {
  // ... existing props
  className?: string;
}

interface MessageInputProps {
  // ... existing props
  className?: string;
}

interface TopicSuggestionsProps {
  // ... existing props
  className?: string;
}

interface UserSettingsProps {
  preferences: UserPreferences;
  onUpdate: (newPreferences: Partial<UserPreferences>) => void;
  onClose: () => void;
  className?: string;
}

interface ToastProps {
  // ... existing props
  className?: string;
}
