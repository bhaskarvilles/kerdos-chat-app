export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: string;
  username: string;
}

// Legacy User type - keeping for reference during transition
export interface LegacyUser {
  username: string;
  email?: string;
  joinDate?: Date;
  expirationTime: number;
  preferences?: {
    notifications: boolean;
    language: string;
    timezone: string;
  };
  subscription?: {
    tier: 'free' | 'premium';
    expiresAt?: number;
    messageCount: number;
    lastResetTime: number;
  };
}

// New UserProfile type to store additional user data in Supabase
export interface UserProfile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  preferences?: {
    notifications: boolean;
    language: string;
    timezone: string;
  };
}

// New UserSubscription type to store subscription data in Supabase
export interface UserSubscription {
  id: string;
  user_id: string;
  tier: 'free' | 'premium';
  status: 'active' | 'canceled' | 'expired';
  starts_at: string;
  expires_at?: string;
  message_count: number;
  last_reset_time: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  username: string;
  email?: string;
  joinDate?: Date;
  expirationTime: number;
  preferences?: {
    notifications: boolean;
    language: string;
    timezone: string;
  };
  subscription?: {
    tier: 'free' | 'premium';
    expiresAt?: number;
    messageCount: number;
    lastResetTime: number;
  };
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
  messageDisplay: 'modern' | 'classic';
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
  lineSpacing: 'normal' | 'wide'
  dyslexicFont: boolean
  colorScheme: 'default' | 'high-contrast'
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

// Add a new interface for subscription tiers
export interface SubscriptionTier {
  name: string;
  price: number;
  features: string[];
  messageLimit: number | null; // null means unlimited
  resetPeriod: number; // in milliseconds
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}
