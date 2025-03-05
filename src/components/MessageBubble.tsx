import React, { useState } from 'react';
import { Message, UserPreferences } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Clock, Copy, User, ThumbsUp, ThumbsDown, Bot } from 'lucide-react';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  message: Message;
  preferences: UserPreferences;
  isLast?: boolean;
}

const CodeBlock: React.FC<any> = ({ language, children }) => {
  return (
    <SyntaxHighlighter
      style={atomDark}
      language={language}
      PreTag="div"
      className="!my-0 !bg-gray-900 !rounded-lg"
      showLineNumbers
    >
      {String(children).replace(/\n$/, '')}
    </SyntaxHighlighter>
  );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, preferences, isLast }) => {
  const [isCopied, setIsCopied] = useState(false);
  const isUser = message.role === 'user';
  
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  const formattedDate = new Date(message.timestamp).toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });

  const getFontSize = () => {
    switch (preferences?.fontSize) {
      case 'small': return 'text-sm';
      case 'large': return 'text-lg';
      default: return 'text-base';
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start gap-3 max-w-full`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 order-${isUser ? '2' : '1'}`}>
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center
          ${isUser ? 'bg-teal-500' : 'bg-violet-500'}
        `}>
          {isUser ? (
            <User size={16} className="text-white" />
          ) : (
            <Bot size={16} className="text-white" />
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className={`
        flex-1 order-${isUser ? '1' : '2'}
        max-w-[calc(100%-4rem)] md:max-w-[75%] lg:max-w-[65%]
      `}>
        <div className={`
          rounded-2xl px-4 py-2.5 
          ${isUser ? 
            'bg-teal-500 text-white ml-auto' : 
            'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
          }
          ${preferences.messageDisplay === 'modern' ? 'shadow-sm' : ''}
        `}>
          <div className={`
            whitespace-pre-wrap break-words
            ${preferences.fontSize === 'small' ? 'text-sm' : 
              preferences.fontSize === 'large' ? 'text-lg' : 
              'text-base'
            }
          `}>
            {message.content}
          </div>
        </div>
        <div className={`
          mt-1 text-xs text-gray-500 dark:text-gray-400
          ${isUser ? 'text-right' : 'text-left'}
        `}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);
