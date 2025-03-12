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
        className="absolute top-2 right-2 p-1 rounded bg-emerald-800 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity"
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
    <div 
      className={`flex flex-col mb-6 ${isUser ? 'items-end' : 'items-start'} animate-fadeIn`}
      id={`message-${message.id}`}
    >
      <div className="flex items-center mb-1 space-x-2">
        <div className={`flex items-center ${isUser ? 'order-2' : 'order-1'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser 
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
              : 'bg-gradient-to-br from-teal-500 to-emerald-600'
          }`}>
            {isUser ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
          </div>
        </div>
        <div className={`text-xs text-gray-500 dark:text-gray-400 ${isUser ? 'order-1 mr-2' : 'order-2 ml-2'}`}>
          <span className="font-medium">{message.username}</span>
          <span className="mx-1">•</span>
          <span>{formattedTime}</span>
        </div>
      </div>
      
      <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
        isUser 
          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white' 
          : 'bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-800/30'
      }`}>
        <div className={`prose ${
          preferences.fontSize === 'small' ? 'prose-sm' : 
          preferences.fontSize === 'large' ? 'prose-lg' : 'prose-base'
        } max-w-none ${
          !isUser ? 'dark:prose-invert prose-emerald' : ''
        }`}>
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
        </div>
      </div>
      
      {!isUser && (
        <div className="flex mt-1 space-x-2">
          <button 
            onClick={() => handleCopy(message.content)}
            className="text-xs flex items-center space-x-1 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
            aria-label="Copy message"
          >
            {isCopied ? <Check size={12} /> : <Copy size={12} />}
            <span>{isCopied ? 'Copied' : 'Copy'}</span>
          </button>
          
          <div className="flex space-x-1">
            <button 
              className="p-1 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
              aria-label="Thumbs up"
            >
              <ThumbsUp size={12} />
            </button>
            <button 
              className="p-1 rounded-full hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 transition-colors"
              aria-label="Thumbs down"
            >
              <ThumbsDown size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MessageBubble);
