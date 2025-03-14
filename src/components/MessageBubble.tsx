import React from 'react';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message
}) => {
  const timestamp = new Date(message.timestamp);
  const timeString = timestamp.toLocaleTimeString();
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      } mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-lg p-4 ${
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted'
        }`}
      >
        <div className="text-sm">{message.content}</div>
        <div className="text-xs mt-2 opacity-70">{timeString}</div>
      </div>
    </div>
  );
};

export default MessageBubble;
