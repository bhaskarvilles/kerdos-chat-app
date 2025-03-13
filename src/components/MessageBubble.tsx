import React from 'react';
import { Message, UserPreferences } from '../types';
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  preferences: UserPreferences;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, preferences }) => {
  const isUser = message.role === 'user';
  const timestamp = new Date(message.timestamp);
  const timeAgo = formatDistanceToNow(timestamp, { addSuffix: true });

  return (
    <div className={cn(
      "flex",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[85%] sm:max-w-[75%] rounded-lg p-3",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted"
      )}>
        <div className="flex flex-col gap-1">
          <div className="text-sm sm:text-base whitespace-pre-wrap break-words">
            {message.content}
          </div>
          <div className="flex items-center justify-between gap-2 text-xs opacity-70">
            <span>{message.username}</span>
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
