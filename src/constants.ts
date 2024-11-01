export const CHAT_STORAGE_KEY = 'chats'
export const USER_PREFERENCES_KEY = 'userPreferences'
export const NEW_CHAT_NAME = 'New Chat'

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  fontSize: 'medium',
  messageDisplay: 'modern',
  persistentChats: true,
  chatHistory: true,
  maxHistoryDays: 30,
  theme: 'light',
  enableNotifications: true,
  soundNotifications: false,
  notificationVolume: 0.5
}
