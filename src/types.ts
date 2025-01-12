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
  fontSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark';
  chatHistory: boolean;
  maxHistoryDays: number;
  enableNotifications: boolean;
  soundNotifications: boolean;
  notificationVolume: number;
  messageDisplay: string;
  persistentChats: boolean;
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
export interface SidebarProps {
  chats: Chat[];
  activeChat: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onSignOut: () => void;
  onExportChat: () => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  theme: 'light' | 'dark';
  userPreferences: UserPreferences;
  className?: string;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobile?: boolean;
}

export interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
  isLoading: boolean;
  preferences: UserPreferences;
  className?: string;
}

export interface TopicSuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  onHideSuggestions: () => void;
  className?: string;
}

export interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>;
  className?: string;
}

export interface UserSettingsProps {
  preferences: UserPreferences;
  onUpdate: (newPreferences: Partial<UserPreferences>) => void;
  onClose: () => void;
  className?: string;
}

export interface ToastProps {
  message: string;
  onClose: () => void;
  type: 'error' | 'success' | 'info';
  className?: string;
}
