import React from 'react';
import { SidebarProps } from '../types';
import { LogOut, Settings, Sun, Moon, Download, Trash2, MessageSquarePlus, ChevronLeft, ChevronRight, User, MessageCircle } from 'lucide-react';

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
  isCollapsed = false,
  onToggleCollapse,
  className = '',
  userPreferences,
}) => {
  return (
    <div 
      className={`flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200/50 dark:border-gray-700/50 
        transition-[width] duration-300 ease-in-out ${className}`}
      style={{ width: isCollapsed ? '5rem' : '20rem' }}
    >
      {/* Enhanced Header with User Profile */}
      <div className="flex flex-col border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white/90 stroke-[1.5]" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 text-transparent bg-clip-text">
                Kerdos AI Chat
              </h1>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 
              hover:scale-105 active:scale-95"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? 
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300 stroke-[1.5]" /> : 
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300 stroke-[1.5]" />
            }
          </button>
        </div>
      </div>

      {/* Enhanced New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 
            bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 
            text-white rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-98
            shadow-md hover:shadow-lg"
        >
          <MessageSquarePlus className="w-5 h-5 stroke-[1.5]" />
          {!isCollapsed && <span className="font-medium">New Chat</span>}
        </button>
      </div>

      {/* Enhanced Chat List */}
      <div className="flex-1 overflow-y-auto px-3 custom-scrollbar">
        <div className="space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-xl cursor-pointer 
                transition-all duration-200 ${
                chat.id === activeChat
                  ? 'bg-gradient-to-r from-violet-500/90 to-fuchsia-500/90 text-white shadow-md'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800/70'
              }`}
              onClick={() => onChatSelect(chat.id)}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <MessageCircle className={`w-4 h-4 flex-shrink-0 stroke-[1.5] ${
                  chat.id === activeChat ? 'text-white' : 'text-gray-400 dark:text-gray-500'
                }`} />
                <span className={`truncate ${isCollapsed ? 'w-0' : 'w-full'} ${
                  chat.id === activeChat ? 'text-white font-medium' : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {!isCollapsed && chat.name}
                </span>
              </div>
              {!isCollapsed && chat.id === activeChat && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteChat(chat.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-white/20 rounded-lg 
                    transition-all duration-200 active:scale-95"
                  title="Delete chat"
                >
                  <Trash2 className="w-4 h-4 text-white stroke-[1.5]" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Footer Actions */}
      <div className="p-3 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className={`flex ${isCollapsed ? 'flex-col space-y-2' : 'items-center justify-evenly'}`}>
          <button
            onClick={onToggleTheme}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 
              hover:scale-105 active:scale-95"
            title={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          >
            {theme === 'dark' ? 
              <Sun className="w-5 h-5 text-amber-500 stroke-[1.5]" /> : 
              <Moon className="w-5 h-5 text-blue-500 stroke-[1.5]" />
            }
          </button>
          
          <button
            onClick={onExportChat}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 
              hover:scale-105 active:scale-95"
            title="Export Chat"
          >
            <Download className="w-5 h-5 text-emerald-500 dark:text-emerald-400 stroke-[1.5]" />
          </button>
          
          <button
            onClick={onOpenSettings}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 
              hover:scale-105 active:scale-95"
            title="Settings"
          >
            <Settings className="w-5 h-5 text-violet-500 dark:text-violet-400 stroke-[1.5]" />
          </button>
          
          <button
            onClick={onSignOut}
            className="p-2.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all duration-200 
              hover:scale-105 active:scale-95"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 text-red-500 dark:text-red-400 stroke-[1.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Add custom scrollbar styles to your CSS
const styles = `
  .custom-scrollbar::-webkit-scrollbar {
    width: 5px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: rgba(156, 163, 175, 0.5);
    border-radius: 20px;
  }
  
  .custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: rgba(156, 163, 175, 0.7);
  }
`;

// Add style tag to document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Sidebar;
