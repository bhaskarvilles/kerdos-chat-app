import React from 'react';
import MessageBubble from './MessageBubble';
import { Message } from '../types';

interface ChatWindowProps {
  messages: Message[];
  className?: string;
  onSendMessage?: (message: string) => void;
  isLoading?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  className,
  isLoading,
}) => {
  return (
    <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${className || ''}`}>
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
        />
      ))}
      {isLoading && <div className="text-center text-gray-500">Loading...</div>}
    </div>
  );
};
