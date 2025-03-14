import React from 'react';
import { Chat } from '../types';
import { Plus, Trash2, Settings, LogOut, Download, Sun, Moon } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

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
  isCollapsed?: boolean;
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
  isCollapsed = false,
}) => {
  return (
    <div className={cn(
      "flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700",
      isCollapsed && "w-16",
      !isCollapsed && "w-64"
    )}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="icon"
          onClick={onNewChat}
          className="h-8 w-8"
        >
          <Plus className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="h-8 w-8"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenSettings}
            className="h-8 w-8"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={cn(
              "flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700",
              activeChat === chat.id && "bg-gray-100 dark:bg-gray-700"
            )}
            onClick={() => onChatSelect(chat.id)}
          >
            <span className="truncate">{chat.name}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="h-6 w-6"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="icon"
          onClick={onExportChat}
          className="h-8 w-8"
        >
          <Download className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onSignOut}
          className="h-8 w-8"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
