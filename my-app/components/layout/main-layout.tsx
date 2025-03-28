'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Menu, X, Plus, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useChat } from '@/contexts/chat-context';
import { useRouter } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatInterface } from '@/components/chat/chat-interface';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentUser, logout } = useAuth();
  const { chats, currentChat, selectChat, createNewChat, deleteChat } = useChat();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
              <h1 className="text-xl font-semibold">Kerdos Chat</h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {currentUser && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentUser.avatar || undefined} />
                        <AvatarFallback>{currentUser.name?.[0] || '?'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {currentUser.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/settings')}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex h-[calc(100vh-4rem)]">
          {/* Sidebar */}
          <Card 
            className={cn(
              "w-80 border-r rounded-none flex flex-col fixed lg:relative inset-y-0 left-0 z-50 transform transition-transform duration-200 ease-in-out",
              isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
            )}
          >
            {/* User Profile */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={currentUser?.avatar || undefined} />
                  <AvatarFallback>{currentUser?.name?.[0] || '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{currentUser?.name}</h2>
                  <p className="text-sm text-muted-foreground">Online</p>
                </div>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Chat List */}
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-2">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    className={cn(
                      'group flex items-center gap-2 rounded-lg p-2 hover:bg-accent cursor-pointer',
                      currentChat?.id === chat.id && 'bg-accent'
                    )}
                  >
                    <Button
                      variant="ghost"
                      className="flex-1 justify-start gap-2 h-auto p-0"
                      onClick={() => selectChat(chat.id)}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/ai-avatar.png" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{chat.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {chat.messages && chat.messages.length > 0
                            ? `${chat.messages[chat.messages.length - 1].content.slice(0, 30)}${
                                chat.messages[chat.messages.length - 1].content.length > 30 ? '...' : ''
                              }`
                            : 'No messages yet'}
                        </span>
                      </div>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                      onClick={() => deleteChat(chat.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* New Chat Button */}
            <div className="p-4 border-t">
              <Button className="w-full" onClick={createNewChat}>
                <Plus className="mr-2 h-4 w-4" />
                New Chat
              </Button>
            </div>
          </Card>

          {/* Main Content */}
          <div className="flex-1">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
} 