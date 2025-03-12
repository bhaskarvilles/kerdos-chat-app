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

// Custom component for code blocks to avoid TypeScript errors
const CodeBlock = ({ className, children }: { className?: string; children: React.ReactNode }) => {
  const [isCopied, setIsCopied] = useState(false);
  const language = /language-(\w+)/.exec(className || '');
  const code = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button 
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1 rounded bg-gray-800 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {isCopied ? <Check size={14} /> : <Copy size={14} />}
      </button>
      <SyntaxHighlighter
        language={(language && language[1]) || ''}
        style={atomDark}
        showLineNumbers
        customStyle={{ margin: '8px 0', borderRadius: '0.5rem', background: '#1a202c' }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
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
            prose prose-sm dark:prose-invert max-w-none
            ${preferences.fontSize === 'small' ? 'text-sm prose-sm' : 
              preferences.fontSize === 'large' ? 'text-lg prose-lg' : 
              'text-base prose-base'
            }
            ${isUser ? 'prose-headings:text-white prose-a:text-white prose-strong:text-white' : ''}
          `}>
            {isUser ? (
              <div className="whitespace-pre-wrap break-words">{message.content}</div>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return match ? (
                      <CodeBlock className={className}>{children}</CodeBlock>
                    ) : (
                      <code className={`${className} bg-gray-200 dark:bg-gray-800 px-1 py-0.5 rounded`}>
                        {children}
                      </code>
                    );
                  },
                  p({ children }) {
                    return <p className="mb-2 last:mb-0">{children}</p>;
                  },
                  ul({ children }) {
                    return <ul className="list-disc pl-5 mb-2 last:mb-0">{children}</ul>;
                  },
                  ol({ children }) {
                    return <ol className="list-decimal pl-5 mb-2 last:mb-0">{children}</ol>;
                  },
                  li({ children }) {
                    return <li className="mb-1">{children}</li>;
                  },
                  a({ href, children }) {
                    return <a href={href} target="_blank" rel="noopener noreferrer" className="underline">{children}</a>;
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span>{formattedTime}</span>
          {!isUser && (
            <div className="flex items-center space-x-2">
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" aria-label="Thumbs up">
                <ThumbsUp size={12} />
              </button>
              <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors" aria-label="Thumbs down">
                <ThumbsDown size={12} />
              </button>
              <button 
                onClick={() => handleCopy(message.content)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                aria-label="Copy message"
              >
                {isCopied ? <Check size={12} /> : <Copy size={12} />}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);
