import React, { forwardRef } from 'react';
import { Message, UserPreferences } from '../types';
import MessageBubble from './MessageBubble';
import LoadingBubble from './LoadingBubble';

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
  preferences: UserPreferences;
  className?: string;
}

const ChatWindow = forwardRef<HTMLDivElement, ChatWindowProps>(
  ({ messages, isLoading, preferences, className = '' }, ref) => {
    return (
      <div ref={ref} className={`h-full overflow-y-auto p-4 ${className}`}>
        {messages?.map((message) => (
          <MessageBubble 
            key={message.id} 
            message={message} 
            preferences={preferences}
          />
        ))}
        {isLoading && <LoadingBubble />}
      </div>
    );
  }
);

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;
