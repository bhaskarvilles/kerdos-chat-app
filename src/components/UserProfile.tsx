import React, { useState, useEffect } from 'react';
import { User, UserPreferences } from '../types';
import { Settings, User as UserIcon, Shield, Crown, Mail, Calendar, LogOut, X } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';

interface UserProfileProps {
  user: User;
  isPaidUser?: boolean;
  preferences?: UserPreferences;
  onUpdateProfile?: (updates: Partial<User>) => void;
  onOpenSettings?: () => void;
  onSignOut?: () => void;
  onClose?: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({
  user,
  isPaidUser = user?.subscription?.tier === 'premium',
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
    if (onUpdateProfile) {
      onUpdateProfile(editedUser);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    if (!onClose) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // If this is being rendered inside another component without a modal
  if (!onClose) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 flex items-center justify-center text-white text-2xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div className="ml-4">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user.username}</h2>
            <div className="flex items-center mt-1">
              <span className={`px-2 py-1 rounded-full text-xs ${
                isPaidUser 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {isPaidUser ? 'Premium' : 'Free'} User
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {user.email && (
            <div className="flex items-center">
              <Mail className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
            </div>
          )}
          
          {user.joinDate && (
            <div className="flex items-center">
              <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
              <span className="text-gray-700 dark:text-gray-300">Joined {formatDate(user.joinDate)}</span>
            </div>
          )}
          
          <div className="flex items-center">
            <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-2" />
            <span className="text-gray-700 dark:text-gray-300">
              Account expires {new Date(user.expirationTime).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Original modal version
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="relative h-32 bg-gradient-to-r from-teal-500 to-emerald-500">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          {isPaidUser && (
            <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
              <Crown className="w-4 h-4 mr-1" />
              Premium
            </div>
          )}
        </div>
        
        {/* Profile content */}
        <div className="px-6 pt-0 pb-6 -mt-16">
          <div className="flex justify-between items-end mb-6">
            <div className="flex items-end">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                <UserIcon className="w-12 h-12 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="ml-4 mb-2">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{user.username}</h2>
                {user.email && <p className="text-gray-600 dark:text-gray-400">{user.email}</p>}
              </div>
            </div>
            
            <button
              onClick={() => setIsEditing(true)}
              className="text-teal-600 hover:text-teal-700 dark:text-teal-500 dark:hover:text-teal-400"
            >
              Edit
            </button>
          </div>
          
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={editedUser.email || ''}
                  onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="space-y-4">
                {user.joinDate && (
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                    <span className="text-gray-700 dark:text-gray-300">Joined {formatDate(user.joinDate)}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Shield className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Account expires {new Date(user.expirationTime).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-3">
                <button
                  onClick={onOpenSettings}
                  className="w-full flex items-center justify-between px-4 py-2 text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 mr-3" />
                    <span>Settings</span>
                  </div>
                </button>
                
                <button
                  onClick={onSignOut}
                  className="w-full flex items-center justify-between px-4 py-2 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                >
                  <div className="flex items-center">
                    <LogOut className="w-5 h-5 mr-3" />
                    <span>Sign Out</span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile; 