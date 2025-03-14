import React from 'react';
import { X, Save } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { UserPreferences } from '../types';

interface UserSettingsProps {
  preferences: UserPreferences;
  onUpdate: (newPreferences: Partial<UserPreferences>) => void;
  onClose: () => void;
}

const UserSettings: React.FC<UserSettingsProps> = ({
  preferences,
  onUpdate,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <Label>Theme</Label>
            <Select
              value={preferences.theme}
              onValueChange={(value: 'light' | 'dark') => onUpdate({ theme: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Font Size</Label>
            <Select
              value={preferences.fontSize}
              onValueChange={(value: 'small' | 'medium' | 'large') => onUpdate({ fontSize: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Notifications</Label>
              <p className="text-sm text-gray-500">Receive notifications for new messages</p>
            </div>
            <Switch
              checked={preferences.enableNotifications}
              onCheckedChange={(checked) => onUpdate({ enableNotifications: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sound Notifications</Label>
              <p className="text-sm text-gray-500">Play sound when receiving notifications</p>
            </div>
            <Switch
              checked={preferences.soundNotifications}
              onCheckedChange={(checked) => onUpdate({ soundNotifications: checked })}
            />
          </div>

          <div>
            <Label>Notification Volume</Label>
            <input
              type="range"
              min="0"
              max="100"
              value={preferences.notificationVolume}
              onChange={(e) => onUpdate({ notificationVolume: parseInt(e.target.value) })}
              className="w-full"
            />
          </div>

          <div>
            <Label>Message Display</Label>
            <Select
              value={preferences.messageDisplay}
              onValueChange={(value: 'modern' | 'classic') => onUpdate({ messageDisplay: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">Modern</SelectItem>
                <SelectItem value="classic">Classic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Persistent Chats</Label>
              <p className="text-sm text-gray-500">Keep chat history between sessions</p>
            </div>
            <Switch
              checked={preferences.persistentChats}
              onCheckedChange={(checked) => onUpdate({ persistentChats: checked })}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={onClose}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
