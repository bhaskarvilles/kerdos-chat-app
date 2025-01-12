export const CHAT_STORAGE_KEY = 'chats'
export const USER_PREFERENCES_KEY = 'userPreferences'
export const NEW_CHAT_NAME = 'New Chat'

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
