import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { Message } from '../types'

interface MessageBubbleProps {
  message: Message
  style: string
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, style }) => {
  return (
    <div
      className={`flex ${
        message.sender === 'user' ? 'justify-end' : 'justify-start'
      } animate-fade-in`}
    >
      <div
        className={`max-w-[80%] px-4 py-2 ${style} ${
          message.sender === 'user'
            ? 'bg-green-500 dark:bg-green-600 text-white'
            : 'bg-green-100 dark:bg-gray-700 text-green-800 dark:text-green-200'
        } shadow-md transition-all duration-200 ease-in-out hover:shadow-lg`}
      >
        <p className="text-xs font-bold mb-1">{message.username}</p>
        <ReactMarkdown
          className="mb-1 text-sm sm:text-base"
          remarkPlugins={[remarkGfm]}
          components={{
            code({node, inline, className, children, ...props}) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <SyntaxHighlighter
                  style={tomorrow}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              )
            }
          }}
        >
          {message.content}
        </ReactMarkdown>
        <span className="text-xs opacity-75 block">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}

export default MessageBubble