import React from 'react'
import { X } from 'lucide-react'
import { UserPreferences } from '../types'

interface UserSettingsProps {
  preferences: UserPreferences
  onUpdatePreferences: (newPreferences: Partial<UserPreferences>) => void
  onClose: () => void
}

const UserSettings: React.FC<UserSettingsProps> = ({ preferences, onUpdatePreferences, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
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
              onChange={(e) => onUpdatePreferences({ fontSize: e.target.value as 'medium' | 'large' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
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
        </div>
      </div>
    </div>
  )
}

export default UserSettings