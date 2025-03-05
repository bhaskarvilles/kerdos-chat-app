import React, { useState, useEffect } from 'react';
import { User, UserPreferences } from '../types';
import { Settings, User as UserIcon, Shield, Crown, Mail, Calendar, LogOut, X } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

interface UserProfileProps {
  user: User;
  isPaidUser: boolean;
  preferences: UserPreferences;
  onUpdateProfile: (updates: Partial<User>) => void;
  onOpenSettings: () => void;
  onSignOut: () => void;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isPaidUser,
  preferences,
  onUpdateProfile,
  onOpenSettings,
  onSignOut,
  onClose,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(editedUser);
    setIsEditing(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-teal-500 to-emerald-500">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 
              transition-colors duration-200 text-white"
          >
            <X size={20} />
          </button>
          <div className="absolute -bottom-16 left-6 w-32 h-32 rounded-2xl overflow-hidden border-4 border-white dark:border-gray-800 bg-white dark:bg-gray-700 shadow-lg">
            <div className="w-full h-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
              <UserIcon size={48} className="text-white" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="pt-20 px-6 pb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Info */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedUser.username}
                      onChange={(e) => setEditedUser({ ...editedUser, username: e.target.value })}
                      className="text-2xl font-bold bg-transparent border-b-2 border-teal-500 focus:outline-none"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {user.username}
                    </h2>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    {isPaidUser ? (
                      <span className="flex items-center gap-1 text-sm text-amber-600 dark:text-amber-400">
                        <Crown size={16} />
                        Pro Member
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Shield size={16} />
                        Free Plan
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Settings size={20} className="text-gray-500" />
                </button>
              </div>

              {/* User Details */}
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Mail className="w-5 h-5" />
                  <span>{user.email || 'No email provided'}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                  <Calendar className="w-5 h-5" />
                  <span>Member since {formatDate(user.joinDate || new Date())}</span>
                </div>
              </div>
            </div>

            {/* Preferences Summary */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Preferences
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Theme</p>
                  <p className="text-gray-600 dark:text-gray-400 capitalize">{preferences.theme}</p>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Font Size</p>
                  <p className="text-gray-600 dark:text-gray-400 capitalize">{preferences.fontSize}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenSettings}
                className="w-full mt-2 px-4 py-2 text-sm text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-900/20 rounded-lg transition-colors"
              >
                Manage Preferences
              </button>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4">
              {isEditing && (
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 
                    text-white rounded-lg hover:from-teal-600 hover:to-emerald-600 
                    transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Save Changes
                </button>
              )}
              <button
                type="button"
                onClick={onSignOut}
                className="w-full px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 
                  rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </form>
        </div>
      </div>

      <div 
        className="absolute inset-0 -z-10" 
        onClick={onClose}
      />
    </div>
  );
};

export default UserProfile; 