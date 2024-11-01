import React from 'react'
import { Message } from '../types'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Check, CheckCheck } from 'lucide-react'

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  if (!message) {
    console.warn('MessageBubble: message prop is undefined');
    return null;
  }

  const isUser = message.role === 'user';
  const timestamp = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className={`group flex flex-col mb-6 max-w-[85%] md:max-w-[75%] ${
      isUser ? 'items-end self-end' : 'items-start self-start'
    }`}>
      {/* Username and Timestamp */}
      <div className={`flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mb-1 
        ${isUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
      >
        <span className="font-medium">{message.username}</span>
        <span>•</span>
        <span>{timestamp}</span>
      </div>
      
      {/* Message Bubble */}
      <div className={`relative rounded-2xl px-4 py-3 shadow-md
        transform transition-transform duration-200 hover:scale-[1.01]
        ${isUser 
          ? 'bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white rounded-br-lg' 
          : 'bg-white dark:bg-gray-800 rounded-bl-lg border border-gray-100 dark:border-gray-700'
        }
        ${isUser ? 'rounded-br-sm' : 'rounded-bl-sm'}
      `}>
        {/* Message Content */}
        <div className={`text-sm md:text-base ${
          isUser 
            ? 'text-white' 
            : 'text-gray-800 dark:text-gray-200'
        }`}>
          {isUser ? (
            <div className="whitespace-pre-wrap break-words">
              {message.content}
            </div>
          ) : (
            <ReactMarkdown
              components={{
                code({inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <div className="relative group/code my-4 rounded-lg overflow-hidden">
                      <div className="absolute right-2 top-2 opacity-0 group-hover/code:opacity-100 transition-opacity">
                        <button
                          onClick={() => navigator.clipboard.writeText(String(children))}
                          className="px-2 py-1 text-xs bg-gray-800/50 text-white rounded hover:bg-gray-800 transition-colors"
                        >
                          Copy
                        </button>
                      </div>
                      <SyntaxHighlighter
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
                  )
                },
                h1: ({children}) => (
                  <h1 className="text-xl font-bold my-4 border-b pb-2 dark:border-gray-700">{children}</h1>
                ),
                h2: ({children}) => (
                  <h2 className="text-lg font-bold my-3 border-b pb-2 dark:border-gray-700">{children}</h2>
                ),
                h3: ({children}) => (
                  <h3 className="text-md font-bold my-2">{children}</h3>
                ),
                p: ({children}) => (
                  <p className="my-2 leading-relaxed">{children}</p>
                ),
                ul: ({children}) => (
                  <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>
                ),
                ol: ({children}) => (
                  <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>
                ),
                li: ({children}) => (
                  <li className="my-1 ml-2">{children}</li>
                ),
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-violet-300 dark:border-violet-600 pl-4 my-3 italic bg-gray-50 dark:bg-gray-900/50 py-2 rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                a: ({children, href}) => (
                  <a 
                    href={href} 
                    className="text-violet-500 hover:text-violet-600 dark:text-violet-400 dark:hover:text-violet-300 
                      underline decoration-2 underline-offset-2 transition-colors" 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {message.content || ''}
            </ReactMarkdown>
          )}
        </div>

        {/* Time tooltip on hover */}
        <div className={`absolute ${isUser ? 'left-0' : 'right-0'} -bottom-6 
          opacity-0 group-hover:opacity-100 transition-opacity duration-200
          text-xs text-gray-500 dark:text-gray-400`}
        >
          {new Date(message.timestamp).toLocaleString()}
        </div>
      </div>
      
      {/* Enhanced Message Status - Only for user messages */}
      {isUser && (
        <div className="flex items-center space-x-0.5 mt-1">
          <span className="text-xs text-gray-400 dark:text-gray-500 mr-1">Sent</span>
          <div className="flex -space-x-1">
            <Check className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
            <Check className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(MessageBubble);
