import React, { forwardRef, useRef, useEffect } from 'react';
import { Message, UserPreferences } from '../types';
import MessageBubble from './MessageBubble';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ui/use-theme";

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
  preferences: UserPreferences;
  className?: string;
  onSendMessage?: (content: string) => Promise<void>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  onSendMessage,
  isLoading,
  preferences,
  className
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={cn(
      "flex flex-col h-full overflow-y-auto",
      isDarkMode ? "bg-gray-900" : "bg-gray-50",
      className
    )}>
      <div className="flex-1 p-2 sm:p-4 space-y-4">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            isUser={message.role === 'user'}
            preferences={preferences}
          />
        ))}
        {isLoading && (
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            <span className="text-sm">AI is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;
