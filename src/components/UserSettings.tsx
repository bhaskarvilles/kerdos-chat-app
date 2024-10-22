import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { UserPreferences } from '../types'

interface UserSettingsProps {
  preferences: UserPreferences
  onUpdatePreferences: (newPreferences: Partial<UserPreferences>) => void
  onClose: () => void
  isPaidUser: boolean
  onOpenAIKeySubmit: (key: string) => void
}

const UserSettings: React.FC<UserSettingsProps> = ({ 
  preferences, 
  onUpdatePreferences, 
  onClose, 
  isPaidUser,
  onOpenAIKeySubmit
}) => {
  const [openAIKey, setOpenAIKey] = useState('')

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  const handleOpenAIKeySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (openAIKey.trim()) {
      onOpenAIKeySubmit(openAIKey.trim())
      setOpenAIKey('')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-800 dark:text-green-200">User Settings</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Font Size
            </label>
            <select
              id="fontSize"
              value={preferences.fontSize}
              onChange={(e) => onUpdatePreferences({ fontSize: e.target.value as 'small' | 'medium' | 'large' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div>
            <label htmlFor="messageDisplay" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Message Display
            </label>
            <select
              id="messageDisplay"
              value={preferences.messageDisplay}
              onChange={(e) => onUpdatePreferences({ messageDisplay: e.target.value as 'bubbles' | 'flat' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="bubbles">Bubbles</option>
              <option value="flat">Flat</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="persistentChats"
              checked={preferences.persistentChats}
              onChange={(e) => onUpdatePreferences({ persistentChats: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="persistentChats" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enable Persistent Chats
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="chatHistory"
              checked={preferences.chatHistory}
              onChange={(e) => onUpdatePreferences({ chatHistory: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="chatHistory" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Store Chat History
            </label>
          </div>
          {preferences.chatHistory && (
            <div>
              <label htmlFor="maxHistoryDays" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max History Days
              </label>
              <input
                type="number"
                id="maxHistoryDays"
                value={preferences.maxHistoryDays}
                onChange={(e) => onUpdatePreferences({ maxHistoryDays: parseInt(e.target.value) })}
                min="1"
                max="30"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          )}
          <div>
            <label htmlFor="theme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Theme
            </label>
            <select
              id="theme"
              value={preferences.theme}
              onChange={(e) => onUpdatePreferences({ theme: e.target.value as 'light' | 'dark' | 'system' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System</option>
            </select>
          </div>
          {isPaidUser && (
            <div>
              <label htmlFor="openAIKey" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                OpenAI API Key
              </label>
              <form onSubmit={handleOpenAIKeySubmit} className="flex">
                <input
                  type="password"
                  id="openAIKey"
                  value={openAIKey}
                  onChange={(e) => setOpenAIKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-r-md hover:bg-green-600 transition-colors duration-200"
                >
                  Save
                </button>
              </form>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Your API key will be stored securely and will expire after 1 hour.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UserSettings
