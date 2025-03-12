import { UserPreferences } from './types'

export const CHAT_STORAGE_KEY = 'chats'
export const USER_PREFERENCES_KEY = 'userPreferences'
export const NEW_CHAT_NAME = 'New Chat'

// OpenAI API constants
export const OPENAI_API_KEY = "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"
export const OPENAI_ORG_ID = "org-DaOhrOMWKU5jxwR9us1QV1Mx"

// Subscription constants
export const FREE_TIER_MESSAGE_LIMIT = 5
export const FREE_TIER_RESET_PERIOD = 60 * 60 * 1000 // 1 hour in milliseconds

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  fontSize: 'medium',
  theme: 'light',
  chatHistory: true,
  maxHistoryDays: 30,
  enableNotifications: true,
  soundNotifications: false,
  notificationVolume: 0.5,
  messageDisplay: 'modern',
  persistentChats: true
}
