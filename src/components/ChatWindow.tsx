import React, { forwardRef } from 'react';
import { ChatWindowProps } from '../types';
import MessageBubble from './MessageBubble';

const ChatWindow = forwardRef<HTMLDivElement, ChatWindowProps>(
  ({ messages, isLoading, className = '' }, ref) => {
    return (
      <div ref={ref} className={`h-full overflow-y-auto p-4 ${className}`}>
        {messages?.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    );
  }
);

ChatWindow.displayName = 'ChatWindow';

export default ChatWindow;
