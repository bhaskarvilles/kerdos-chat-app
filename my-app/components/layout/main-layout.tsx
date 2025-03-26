'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { User } from '@/app/types/chat';

interface MainLayoutProps {
  children: React.ReactNode;
  currentUser: User;
}

export function MainLayout({ children, currentUser }: MainLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Card className="w-80 border-r rounded-none flex flex-col">
        {/* User Profile */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{currentUser.name}</h2>
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
            {/* Example chat items */}
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="font-medium">AI Assistant</span>
                <span className="text-xs text-muted-foreground">Last message...</span>
              </div>
            </Button>
            {/* Add more chat items here */}
          </div>
        </ScrollArea>

        {/* New Chat Button */}
        <div className="p-4 border-t">
          <Button className="w-full">New Chat</Button>
        </div>
      </Card>

      {/* Main Content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
} 