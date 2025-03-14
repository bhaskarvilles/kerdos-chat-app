import React, { useState } from 'react';
import MessageBubble from './MessageBubble';
import { Message } from '../types';
import { Send } from 'lucide-react';
import { Input } from './ui/input';

interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (content: string) => Promise<void>;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, onSendMessage }) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    
    await onSendMessage(inputMessage);
    setInputMessage('');
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header - Kept minimal and clean */}
      <div className="flex-none h-16 border-b border-gray-200 dark:border-gray-800 
        bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-3xl mx-auto h-full px-4 flex items-center">
          <h1 className="text-lg font-semibold bg-gradient-to-r from-violet-500 to-fuchsia-500 
            text-transparent bg-clip-text">
            Chat Assistant
          </h1>
        </div>
      </div>

      {/* Messages Container - Fixed width and consistent scaling */}
      <div className="flex-1 overflow-hidden relative">
        <div 
          className="absolute inset-0 overflow-y-auto px-4"
          style={{
            scrollBehavior: 'smooth'
          }}
        >
          <div className="max-w-3xl mx-auto py-6">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <MessageBubble 
                  key={message.id || index}
                  message={message}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Input Area - Fixed height and consistent width */}
      <div className="flex-none h-24 border-t border-gray-200 dark:border-gray-800 
        bg-white dark:bg-gray-800">
        <div className="max-w-3xl mx-auto h-full px-4 py-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-3 h-full">
            <div className="flex-1 relative">
              <Input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-4 py-2.5 rounded-xl"
              />
            </div>
            <button 
              type="submit"
              className="flex-none flex items-center justify-center w-11 h-11
                bg-gradient-to-r from-violet-500 to-fuchsia-500 
                text-white rounded-xl hover:from-violet-600 hover:to-fuchsia-600 
                transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer; 