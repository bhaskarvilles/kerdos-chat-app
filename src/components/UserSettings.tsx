import React, { useState, useEffect } from 'react'
import { X, Moon, Sun, Save, Eye, EyeOff } from 'lucide-react'
import { UserPreferences } from '../types'

interface UserSettingsProps {
  preferences: UserPreferences;
  onUpdatePreferences: (newPreferences: Partial<UserPreferences>) => void;
  onClose: () => void;
  isPaidUser?: boolean;
  onOpenAIKeySubmit?: (key: string) => void;
  className?: string;
}

const UserSettings: React.FC<UserSettingsProps> = ({ 
  preferences, 
  onUpdatePreferences, 
  onClose, 
  isPaidUser = false,
  onOpenAIKeySubmit,
  className = ''
}) => {
  const [openAIKey, setOpenAIKey] = useState('')
  const [showAPIKey, setShowAPIKey] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const [localPreferences, setLocalPreferences] = useState<UserPreferences>(preferences)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isDirty) {
          if (window.confirm('You have unsaved changes. Are you sure you want to close?')) {
            onClose();
          }
        } else {
          onClose();
        }
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose, isDirty])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdatePreferences(localPreferences)
    if (openAIKey.trim() && onOpenAIKeySubmit) {
      onOpenAIKeySubmit(openAIKey.trim())
    }
    setIsDirty(false)
  }

  // Handle preference changes
  const handlePreferenceChange = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setLocalPreferences(prev => ({ ...prev, [key]: value }))
    setIsDirty(true)
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <form 
        onSubmit={handleSubmit}
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${className}`}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">
            Settings
          </h2>
          <button 
            type="button"
            onClick={() => isDirty ? window.confirm('Discard changes?') && onClose() : onClose()}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings Content */}
        <div className="p-6 space-y-6">
          {/* Theme Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handlePreferenceChange('theme', 'light')}
                className={`flex items-center justify-center space-x-2 p-3 rounded-xl border transition-all ${
                  localPreferences.theme === 'light'
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <Sun className="w-5 h-5 text-amber-500" />
                <span>Light</span>
              </button>
              <button
                type="button"
                onClick={() => handlePreferenceChange('theme', 'dark')}
                className={`flex items-center justify-center space-x-2 p-3 rounded-xl border transition-all ${
                  localPreferences.theme === 'dark'
                    ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                <Moon className="w-5 h-5 text-blue-500" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Font Size
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => onUpdatePreferences({ fontSize: size })}
                  className={`px-4 py-2 rounded-lg border transition-all
                    ${preferences.fontSize === size
                      ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                  <span className={
                    size === 'small' ? 'text-sm' :
                    size === 'large' ? 'text-lg' :
                    'text-base'
                  }>
                    {size.charAt(0).toUpperCase() + size.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Preview */}
          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50 space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">Preview</p>
            <p className={`
              ${preferences.fontSize === 'small' ? 'text-sm' : 
                preferences.fontSize === 'large' ? 'text-lg' : 
                'text-base'}
              ${preferences.fontFamily}
            `}>
              This is how your messages will look.
            </p>
          </div>

          {/* Chat History Settings */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Store Chat History
              </label>
              <button
                type="button"
                onClick={() => handlePreferenceChange('chatHistory', !localPreferences.chatHistory)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  localPreferences.chatHistory ? 'bg-violet-500' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    localPreferences.chatHistory ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {localPreferences.chatHistory && (
              <div className="space-y-2 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  History Duration (days)
                </label>
                <input
                  type="number"
                  value={localPreferences.maxHistoryDays}
                  onChange={(e) => handlePreferenceChange('maxHistoryDays', Math.max(1, Math.min(30, parseInt(e.target.value))))}
                  min="1"
                  max="30"
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500 transition-all"
                />
              </div>
            )}
          </div>

          {/* OpenAI API Key (Pro Users Only) */}
          {isPaidUser && onOpenAIKeySubmit && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                OpenAI API Key
              </label>
              <div className="relative">
                <input
                  type={showAPIKey ? 'text' : 'password'}
                  value={openAIKey}
                  onChange={(e) => setOpenAIKey(e.target.value)}
                  placeholder="Enter your OpenAI API key"
                  className="w-full px-4 py-2 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-900 focus:ring-2 focus:ring-violet-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowAPIKey(!showAPIKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showAPIKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Your API key will be stored securely and will expire after 1 hour.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={!isDirty && !openAIKey}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-xl 
              transition-all duration-200 ${
              isDirty || openAIKey
                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Save className="w-5 h-5" />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default UserSettings
