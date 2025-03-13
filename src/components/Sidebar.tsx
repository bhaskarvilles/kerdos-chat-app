import React from 'react';
import { Chat, UserPreferences } from '../types';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Menu, 
  Plus, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Download, 
  Sun, 
  Moon, 
  MoreVertical,
  Trash,
  Edit,
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface SidebarProps {
  chats: Chat[];
  activeChat: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onDeleteChat: (chatId: string) => void;
  onRenameChat: (chatId: string, newName: string) => void;
  onSignOut: () => void;
  onExportChat: (format: 'text' | 'pdf') => void;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
  theme: string;
  userPreferences: UserPreferences;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobile: boolean;
  isDarkMode: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChat,
  onChatSelect,
  onNewChat,
  onDeleteChat,
  onRenameChat,
  onSignOut,
  onExportChat,
  onToggleTheme,
  onOpenSettings,
  theme,
  userPreferences,
  isCollapsed,
  onToggleCollapse,
  isMobile,
  isDarkMode,
}) => {
  const sidebarContent = (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between px-4 py-2">
        <h2 className="text-lg font-semibold">Chats</h2>
        <Button variant="ghost" size="icon" onClick={onNewChat}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2">
          {chats.map((chat) => (
            <div key={chat.id} className="flex items-center gap-2">
              <Button
                variant={chat.id === activeChat ? "secondary" : "ghost"}
                className="w-full justify-start gap-2 text-left"
                onClick={() => onChatSelect(chat.id)}
              >
                <MessageSquare className="h-4 w-4" />
                <span className="truncate">{chat.name}</span>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => {
                    const newName = prompt('Enter new name:', chat.name);
                    if (newName) onRenameChat(chat.id, newName);
                  }}>
                    <Edit className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExportChat('pdf')}>
                    <Download className="mr-2 h-4 w-4" />
                    Export as PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onExportChat('text')}>
                    <Download className="mr-2 h-4 w-4" />
                    Export as Text
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDeleteChat(chat.id)}
                    className="text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <Separator />
      
      <div className="p-4 space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2"
          onClick={onToggleTheme}
        >
          {isDarkMode ? (
            <>
              <Sun className="h-4 w-4" />
              Light Mode
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              Dark Mode
            </>
          )}
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2"
          onClick={onOpenSettings}
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        
        <Button 
          variant="ghost" 
          className="w-full justify-start gap-2 text-destructive"
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet open={!isCollapsed} onOpenChange={onToggleCollapse}>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            className="fixed top-4 left-4 z-30 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px] sm:w-[320px] z-50">
          {sidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <aside className={cn(
      "border-r bg-background transition-all duration-150 ease-in-out z-20",
      isCollapsed ? "w-0" : "w-80"
    )}>
      {!isCollapsed && sidebarContent}
    </aside>
  );
};

export default Sidebar;
