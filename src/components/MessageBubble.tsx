import React, { useState } from 'react';
import { Message, UserPreferences } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Clock, Copy } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  preferences: UserPreferences;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, preferences }) => {
  const [showActions, setShowActions] = useState(false);
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

  return (
    <div 
      className={`group relative flex flex-col mb-6 max-w-[85%] md:max-w-[75%] 
        ${isUser ? 'items-end self-end' : 'items-start self-start'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Username and Time */}
      <div className={`flex items-center space-x-2 text-xs mb-1
        ${isUser ? 'text-violet-500' : 'text-gray-500 dark:text-gray-400'}`}>
        <span className="font-medium">{message.username}</span>
      </div>

      {/* Message Content */}
      <div className={`relative rounded-2xl px-4 py-3 
        transform transition-all duration-200 ease-in-out
        hover:shadow-lg
        ${isUser 
          ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-br-lg' 
          : 'bg-white dark:bg-gray-800 rounded-bl-lg border border-gray-100 dark:border-gray-700'
        }`}
      >
        {/* Message Content */}
        <div className={`relative ${getFontSize()} ${isUser ? 'text-white' : 'text-gray-800 dark:text-gray-200'}`}>
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
          ) : (
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <div className="relative group/code my-4 rounded-lg overflow-hidden">
                      <div className="absolute right-2 top-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigator.clipboard.writeText(String(children))}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-800/50 
                            text-white rounded hover:bg-gray-800 transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </button>
                      </div>
                      <SyntaxHighlighter
                        style={atomDark}
                        language={match[1]}
                        PreTag="div"
                        className="!my-0 !bg-gray-900 !rounded-lg"
                        showLineNumbers
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-md text-sm" {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {message.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Hover Actions */}
        <div 
          className={`absolute ${isUser ? '-left-12' : '-right-12'} top-1/2 -translate-y-1/2
            opacity-0 group-hover:opacity-100 transition-opacity duration-200`}
        >
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-full 
            shadow-lg px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Message Status - Only for user messages */}
      {isUser && (
        <div className="flex items-center space-x-1 mt-1 text-xs text-violet-500 dark:text-violet-400">
          <Check className="w-3 h-3" />
          <span>{formattedDate}</span>
        </div>
      )}
    </div>
  );
};

export default React.memo(MessageBubble);
