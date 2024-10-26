import React, { useState } from 'react';
import { Chat, UserPreferences } from '../types';
import { 
  Settings, Download, LogOut, Sun, Moon, Plus, 
  MessageSquare, Trash2, ChevronLeft, ChevronRight,
  MessageCircle, Search, Star, Clock
} from 'lucide-react';

interface SidebarProps {
  chats: Chat[];
  activeChat: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onSignOut: () => void;
  onExportChat: () => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  theme: 'light' | 'dark' | 'system';
  userPreferences: UserPreferences;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChat,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onSignOut,
  onExportChat,
  onToggleTheme,
  onOpenSettings,
  theme,
  userPreferences,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'all' | 'starred' | 'recent'>('all');

  const sidebarWidth = isCollapsed ? 'w-16' : 'w-72';
  const showText = !isCollapsed;

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderQuickActions = () => (
    <div className={`flex ${showText ? 'flex-row justify-around' : 'flex-col items-center space-y-4'} py-4`}>
      <button
        onClick={() => setView('all')}
        className={`p-2 rounded-lg transition-colors duration-200 ${
          view === 'all' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
        }`}
        title="All Chats"
      >
        <MessageCircle size={18} />
      </button>
      <button
        onClick={() => setView('starred')}
        className={`p-2 rounded-lg transition-colors duration-200 ${
          view === 'starred' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
        }`}
        title="Starred"
      >
        <Star size={18} />
      </button>
      <button
        onClick={() => setView('recent')}
        className={`p-2 rounded-lg transition-colors duration-200 ${
          view === 'recent' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white'
        }`}
        title="Recent"
      >
        <Clock size={18} />
      </button>
    </div>
  );

  return (
    <div
      className={`${sidebarWidth} h-full bg-gray-900 text-white flex flex-col shadow-xl
                  transition-all duration-300 ease-in-out relative group`}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-6 bg-gray-900 text-gray-400 hover:text-white
                   rounded-full p-1 shadow-lg z-50 transition-transform duration-300"
      >
        {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {/* Header Section */}
      <div className="p-4 border-b border-gray-800">
        <button
          onClick={onNewChat}
          className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 
                     text-white font-medium py-2.5 rounded-lg flex items-center justify-center
                     transition-all duration-200 shadow-lg hover:shadow-blue-500/25
                     ${!showText ? 'px-2' : 'px-4'}`}
          title="New Chat"
        >
          <Plus size={18} className={showText ? 'mr-2' : ''} />
          {showText && 'New Chat'}
        </button>
      </div>

      {/* Quick Actions */}
      {renderQuickActions()}
      
      {/* Search Bar - Only show in expanded state */}
      {showText && (
        <div className="px-4 mb-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800 text-white rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      )}
      
      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {filteredChats.map((chat) => (
          <div
            key={chat.id}
            className={`group p-3 mx-2 my-1 cursor-pointer rounded-lg flex justify-between items-center
                       transition-all duration-200 hover:bg-gray-800
                       ${activeChat === chat.id ? 'bg-gray-800 shadow-md' : ''}`}
            onClick={() => onChatSelect(chat.id)}
            title={!showText ? chat.name : undefined}
          >
            <div className="flex items-center space-x-3 truncate flex-1">
              <MessageSquare size={18} className="text-gray-400 flex-shrink-0" />
              {showText && (
                <span className="text-sm font-medium truncate">
                  {chat.name || 'New Chat'}
                </span>
              )}
            </div>
            {showText && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 ml-2 p-1 rounded-md
                           text-gray-400 hover:text-red-400 hover:bg-gray-700
                           transition-all duration-200"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-800 space-y-2 bg-gray-900/50 backdrop-blur-sm">
        <div className={`grid ${showText ? 'grid-cols-2' : 'grid-cols-1'} gap-2 mb-3`}>
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center p-2 rounded-lg
                     bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {showText && (
            <button
              onClick={onExportChat}
              className="flex items-center justify-center p-2 rounded-lg
                       bg-gray-800 hover:bg-gray-700 transition-colors duration-200"
              title="Export Chat"
            >
              <Download size={18} />
            </button>
          )}
        </div>

        <button
          onClick={onOpenSettings}
          className={`w-full p-2.5 rounded-lg flex items-center justify-center
                   bg-gray-800 hover:bg-gray-700 transition-colors duration-200
                   ${!showText ? 'px-2' : ''}`}
          title="Settings"
        >
          <Settings size={18} className={showText ? 'mr-2' : ''} />
          {showText && <span className="font-medium">Settings</span>}
        </button>

        <button
          onClick={onSignOut}
          className={`w-full p-2.5 rounded-lg flex items-center justify-center
                   bg-red-500/10 text-red-500 hover:bg-red-500/20
                   transition-colors duration-200
                   ${!showText ? 'px-2' : ''}`}
          title="Sign Out"
        >
          <LogOut size={18} className={showText ? 'mr-2' : ''} />
          {showText && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
