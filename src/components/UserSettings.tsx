import React, { useState, useEffect, useCallback } from 'react'
import { X, Moon, Sun, Save, Eye, EyeOff } from 'lucide-react'
import { UserPreferences } from '../types'
import { debounce } from 'lodash'

interface UserSettingsProps {
  preferences: UserPreferences;
  onUpdate: (newPreferences: Partial<UserPreferences>) => void;
  onClose: () => void;
  isPaidUser?: boolean;
  className?: string;
}

const UserSettings: React.FC<UserSettingsProps> = ({ 
  preferences, 
  onUpdate, 
  onClose, 
  isPaidUser = false,
  className = ''
}) => {
  const [localPreferences, setLocalPreferences] = useState(preferences)
  const [isDirty, setIsDirty] = useState(false)
  const [notificationSupported, setNotificationSupported] = useState(false)
  const debouncedUpdate = useCallback(
    debounce((newPreferences: Partial<UserPreferences>) => {
      onUpdate(newPreferences)
    }, 150),
    [onUpdate]
  )

  // Check for notification support
  useEffect(() => {
    const checkNotificationSupport = () => {
      const supported = 'Notification' in window && 'serviceWorker' in navigator;
      setNotificationSupported(supported);
    };
    checkNotificationSupport();
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  useEffect(() => {
    setLocalPreferences(preferences)
    setIsDirty(false)
  }, [preferences])

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    const newPreferences = { ...localPreferences, [key]: value }
    setLocalPreferences(newPreferences)
    setIsDirty(true)
    debouncedUpdate(newPreferences)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(localPreferences)
    setIsDirty(false)
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${className}`}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Appearance */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h3>
            
            {/* Theme */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Theme
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handlePreferenceChange('theme', 'light')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl border 
                    ${localPreferences.theme === 'light' 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  <Sun size={18} />
                  <span>Light</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePreferenceChange('theme', 'dark')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl border 
                    ${localPreferences.theme === 'dark' 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  <Moon size={18} />
                  <span>Dark</span>
                </button>
              </div>
            </div>
            
            {/* Font Size */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Font Size
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handlePreferenceChange('fontSize', 'small')}
                  className={`px-4 py-2 rounded-xl border 
                    ${localPreferences.fontSize === 'small' 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  Small
                </button>
                <button
                  type="button"
                  onClick={() => handlePreferenceChange('fontSize', 'medium')}
                  className={`px-4 py-2 rounded-xl border 
                    ${localPreferences.fontSize === 'medium' 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  Medium
                </button>
                <button
                  type="button"
                  onClick={() => handlePreferenceChange('fontSize', 'large')}
                  className={`px-4 py-2 rounded-xl border 
                    ${localPreferences.fontSize === 'large' 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  Large
                </button>
              </div>
            </div>
            
            {/* Message Display */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Message Display
              </label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => handlePreferenceChange('messageDisplay', 'modern')}
                  className={`px-4 py-2 rounded-xl border 
                    ${localPreferences.messageDisplay === 'modern' 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  Modern
                </button>
                <button
                  type="button"
                  onClick={() => handlePreferenceChange('messageDisplay', 'classic')}
                  className={`px-4 py-2 rounded-xl border 
                    ${localPreferences.messageDisplay === 'classic' 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' 
                      : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  Classic
                </button>
              </div>
            </div>
          </div>
          
          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
            
            {notificationSupported ? (
              <>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Notifications
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localPreferences.enableNotifications}
                      onChange={(e) => handlePreferenceChange('enableNotifications', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Sound Notifications
                  </label>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localPreferences.soundNotifications}
                      onChange={(e) => handlePreferenceChange('soundNotifications', e.target.checked)}
                      className="sr-only peer"
                      disabled={!localPreferences.enableNotifications}
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600 ${!localPreferences.enableNotifications ? 'opacity-50 cursor-not-allowed' : ''}`}></div>
                  </label>
                </div>
                
                {localPreferences.soundNotifications && localPreferences.enableNotifications && (
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Notification Volume
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={localPreferences.notificationVolume}
                      onChange={(e) => handlePreferenceChange('notificationVolume', parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Notifications are not supported in your browser.
              </div>
            )}
          </div>
          
          {/* Chat History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chat History</h3>
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Save Chat History
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPreferences.chatHistory}
                  onChange={(e) => handlePreferenceChange('chatHistory', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>
            
            {localPreferences.chatHistory && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Keep History For
                </label>
                <select
                  value={localPreferences.maxHistoryDays}
                  onChange={(e) => handlePreferenceChange('maxHistoryDays', parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 
                    bg-white dark:bg-gray-900 focus:ring-2 focus:ring-emerald-500 transition-all"
                >
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                  <option value={365}>1 year</option>
                </select>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Persistent Chats
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localPreferences.persistentChats}
                  onChange={(e) => handlePreferenceChange('persistentChats', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 dark:peer-focus:ring-emerald-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          </div>

          {/* Note about backend service */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              This application uses a secure backend service to handle AI interactions. No API key is required.
            </p>
          </div>
          
          {/* Save Button */}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isDirty}
              className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Save size={18} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
