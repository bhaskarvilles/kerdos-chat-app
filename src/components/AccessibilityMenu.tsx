import React from 'react'
import { X } from 'lucide-react'
import { AccessibilitySettings } from '../types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface AccessibilityMenuProps {
  settings: AccessibilitySettings
  onClose: () => void
  onSettingChange: (setting: keyof AccessibilitySettings, value: string | boolean) => void
}

const AccessibilityMenu: React.FC<AccessibilityMenuProps> = ({ settings, onClose, onSettingChange }) => {
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
            <h3 className="text-lg font-medium mb-2">Text Size</h3>
            <Select
              value={settings.fontSize}
              onValueChange={(value: "medium" | "large") => onSettingChange("fontSize", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select text size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Line Spacing</h3>
            <Select
              value={settings.lineSpacing}
              onValueChange={(value: "normal" | "wide") => onSettingChange("lineSpacing", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select line spacing" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="wide">Wide</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="highContrast"
              checked={settings.highContrast}
              onChange={(e) => onSettingChange("highContrast", e.target.checked)}
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
              onChange={(e) => onSettingChange("reducedMotion", e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="reducedMotion" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Reduced Motion
            </label>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Dyslexic Font</h3>
            <Switch
              checked={settings.dyslexicFont}
              onCheckedChange={(checked) => onSettingChange("dyslexicFont", checked)}
            />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Color Scheme</h3>
            <Select
              value={settings.colorScheme}
              onValueChange={(value: "default" | "high-contrast") => onSettingChange("colorScheme", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select color scheme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="high-contrast">High Contrast</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessibilityMenu