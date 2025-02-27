import React, { useState } from 'react';
import { Message, UserPreferences } from '../types';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Clock, Copy, User, ThumbsUp, ThumbsDown } from 'lucide-react';
import remarkGfm from 'remark-gfm';

interface MessageBubbleProps {
  message: Message;
  preferences: UserPreferences;
  isLast: boolean;
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
    <div 
      className={`
        flex gap-4 py-6 px-4 -mx-4
        ${message.role === 'assistant' ? 'bg-gray-50 dark:bg-gray-800/50' : ''}
        ${isLast ? 'rounded-lg' : ''}
      `}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {message.role === 'assistant' ? (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-emerald-500 
            flex items-center justify-center text-white font-medium shadow-lg">
            AI
          </div>
        ) : (
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 
            flex items-center justify-center text-white shadow-lg">
            <User size={16} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 max-w-3xl space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
            {message.role === 'assistant' ? 'AI Assistant' : message.username}
          </span>
          <span className="text-xs text-gray-500">
            {new Date(message.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>

        <div className={`prose dark:prose-invert max-w-none ${preferences.fontSize}`}>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <div className="relative group my-4">
                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopy(String(children))}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs bg-gray-800/70 
                          text-white rounded-md hover:bg-gray-800 transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check size={12} />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy code</span>
                          </>
                        )}
                      </button>
                    </div>
                    <CodeBlock language={match[1]} {...props}>
                      {children}
                    </CodeBlock>
                  </div>
                ) : (
                  <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 
                    rounded-md text-sm font-mono" {...props}>
                    {children}
                  </code>
                );
              },
              p: (props) => <p className="mb-4 leading-7" {...props} />,
              ul: (props) => <ul className="list-disc pl-4 mb-4 space-y-2" {...props} />,
              ol: (props) => <ol className="list-decimal pl-4 mb-4 space-y-2" {...props} />,
              a: (props) => (
                <a 
                  {...props} 
                  className="text-teal-600 hover:text-teal-700 dark:text-teal-400 
                    dark:hover:text-teal-300 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                />
              ),
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>

        {/* Message Actions */}
        {message.role === 'assistant' && (
          <div className="flex items-center gap-2 pt-2">
            <button 
              onClick={() => handleCopy(message.content)}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 
                hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Copy message"
            >
              {isCopied ? <Check size={14} /> : <Copy size={14} />}
            </button>
            <button 
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 
                hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Like"
            >
              <ThumbsUp size={14} />
            </button>
            <button 
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 
                hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Dislike"
            >
              <ThumbsDown size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(MessageBubble);
