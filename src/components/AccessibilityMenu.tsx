import React from 'react'
import { X } from 'lucide-react'
import { AccessibilitySettings } from '../types'

interface AccessibilityMenuProps {
  settings: AccessibilitySettings
  onClose: () => void
  onChange: (newSettings: Partial<AccessibilitySettings>) => void
}

const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ settings, onClose, onChange }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md" role="dialog" aria-labelledby="accessibilityTitle">
        <div className="flex justify-between items-center mb-4">
          <h2 id="accessibilityTitle" className="text-xl font-bold text-green-800 dark:text-green-200">Accessibility Options</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            aria-label="Close accessibility menu"
          >
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
              value={settings.fontSize}
              onChange={(e) => onChange({ fontSize: e.target.value as 'small' | 'medium' | 'large' | 'x-large' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
              <option value="x-large">Extra Large</option>
            </select>
          </div>
          <div>
            <label htmlFor="lineSpacing" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Line Spacing
            </label>
            <select
              id="lineSpacing"
              value={settings.lineSpacing}
              onChange={(e) => onChange({ lineSpacing: e.target.value as 'normal' | 'relaxed' | 'loose' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="normal">Normal</option>
              <option value="relaxed">Relaxed</option>
              <option value="loose">Loose</option>
            </select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="highContrast"
              checked={settings.highContrast}
              onChange={(e) => onChange({ highContrast: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="highContrast" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              High Contrast Mode
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="reducedMotion"
              checked={settings.reducedMotion}
              onChange={(e) => onChange({ reducedMotion: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="reducedMotion" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Reduced Motion
            </label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="dyslexicFont"
              checked={settings.dyslexicFont}
              onChange={(e) => onChange({ dyslexicFont: e.target.checked })}
              className="mr-2"
            />
            <label htmlFor="dyslexicFont" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Dyslexia-friendly Font
            </label>
          </div>
          <div>
            <label htmlFor="colorScheme" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color Scheme
            </label>
            <select
              id="colorScheme"
              value={settings.colorScheme}
              onChange={(e) => onChange({ colorScheme: e.target.value as 'default' | 'deuteranopia' | 'protanopia' | 'tritanopia' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="default">Default</option>
              <option value="deuteranopia">Deuteranopia</option>
              <option value="protanopia">Protanopia</option>
              <option value="tritanopia">Tritanopia</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessibilityMenu