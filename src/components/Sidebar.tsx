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
      className={`flex flex-col h-full bg-white dark:bg-gray-900 border-r border-emerald-200/50 dark:border-emerald-800/50 
        transition-[width] duration-300 ease-in-out ${className}`}
      style={{ width: isCollapsed ? '5rem' : '20rem' }}
    >
      {/* Enhanced Header with User Profile */}
      <div className="flex flex-col border-b border-emerald-200/50 dark:border-emerald-800/50">
        <div className="flex items-center justify-between p-4">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                <User className="w-6 h-6 text-white/90 stroke-[1.5]" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text">
                Kerdos AI Chat
              </h1>
            </div>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-all duration-200 
              hover:scale-105 active:scale-95"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? 
              <ChevronRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400 stroke-[1.5]" /> : 
              <ChevronLeft className="w-5 h-5 text-emerald-600 dark:text-emerald-400 stroke-[1.5]" />
            }
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
            bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600
            text-white transition-all duration-200 shadow-md hover:shadow-lg
            transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <MessageSquarePlus className="w-5 h-5" />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-2 space-y-1">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                ${activeChat === chat.id 
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200' 
                  : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-700 dark:text-gray-300'
                }
              `}
            >
              <MessageCircle className={`w-5 h-5 ${
                activeChat === chat.id 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-gray-500 dark:text-gray-400'
              }`} />
              {!isCollapsed && (
                <div className="flex-1 min-w-0 flex items-center justify-between">
                  <span className="truncate">{chat.name}</span>
                  {activeChat === chat.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      className="p-1 rounded-lg hover:bg-emerald-200/50 dark:hover:bg-emerald-800/50
                        text-emerald-600 dark:text-emerald-400 opacity-0 group-hover:opacity-100
                        transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-emerald-200/50 dark:border-emerald-800/50 p-4">
        <div className="flex flex-col gap-2">
          <button
            onClick={onExportChat}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20
              text-gray-700 dark:text-gray-300 transition-colors"
          >
            <Download className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            {!isCollapsed && <span>Export Chat</span>}
          </button>
          
          <button
            onClick={onToggleTheme}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20
              text-gray-700 dark:text-gray-300 transition-colors"
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                {!isCollapsed && <span>Dark Mode</span>}
              </>
            ) : (
              <>
                <Sun className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                {!isCollapsed && <span>Light Mode</span>}
              </>
            )}
          </button>
          
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20
              text-gray-700 dark:text-gray-300 transition-colors"
          >
            <Settings className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            {!isCollapsed && <span>Settings</span>}
          </button>
          
          <button
            onClick={onSignOut}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20
              text-gray-700 dark:text-gray-300 transition-colors"
          >
            <LogOut className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            {!isCollapsed && <span>Sign Out</span>}
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
