import React from 'react'
import { Message } from '../types'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface MessageBubbleProps {
  message: Message;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  if (!message) {
    console.warn('MessageBubble: message prop is undefined');
    return null;
  }

  const isUser = message.role === 'user';

  return (
    <div className={`flex flex-col mb-4 ${isUser ? 'items-end' : 'items-start'}`}>
      {/* Username and Timestamp */}
      <div className={`text-xs text-gray-500 dark:text-gray-400 mb-1 ${isUser ? 'text-right' : 'text-left'}`}>
        {message.username} • {new Date(message.timestamp).toLocaleTimeString()}
      </div>
      
      {/* Message Bubble */}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 shadow-sm
        ${isUser 
          ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-br-none' 
          : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-bl-none border border-gray-200/50 dark:border-gray-700/50'
        }`}
      >
        <div className={`text-sm ${
          isUser 
            ? 'text-white' 
            : 'text-gray-800 dark:text-gray-200'
        }`}>
          {isUser ? (
            message.content
          ) : (
            <ReactMarkdown
              components={{
                code({node, inline, className, children, ...props}) {
                  const match = /language-(\w+)/.exec(className || '')
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      className="rounded-md my-2"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className="bg-gray-800/20 dark:bg-gray-900/50 rounded px-1" {...props}>
                      {children}
                    </code>
                  )
                },
                // Style other markdown elements
                h1: ({children}) => <h1 className="text-xl font-bold my-4">{children}</h1>,
                h2: ({children}) => <h2 className="text-lg font-bold my-3">{children}</h2>,
                h3: ({children}) => <h3 className="text-md font-bold my-2">{children}</h3>,
                p: ({children}) => <p className="my-2">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside my-2">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside my-2">{children}</ol>,
                li: ({children}) => <li className="my-1">{children}</li>,
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-2 italic">
                    {children}
                  </blockquote>
                ),
                a: ({children, href}) => (
                  <a href={href} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
                    {children}
                  </a>
                ),
              }}
            >
              {message.content || ''}
            </ReactMarkdown>
          )}
        </div>
      </div>
      
      {/* Message Status - Only for user messages */}
      {isUser && (
        <div className="flex items-center space-x-1 mt-1">
          <span className="text-xs text-gray-400 dark:text-gray-500">Sent</span>
          <svg 
            className="w-3 h-3 text-indigo-500 dark:text-purple-400" 
            fill="none" 
            strokeWidth="2" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;
