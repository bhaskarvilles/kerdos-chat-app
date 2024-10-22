import React from 'react'
import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import remarkGfm from 'remark-gfm'
import { Message } from '../types'
import { User, Bot } from 'lucide-react'

interface MessageBubbleProps {
  message: Message
  style: string
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, style }) => {
  const isUser = message.sender === 'user'

  return (
    <div
      className={`flex ${
        isUser ? 'justify-end' : 'justify-start'
      } animate-fade-in items-end mb-4`}
    >
      {!isUser && (
        <div className="mr-2 mb-1">
          <Bot className="w-8 h-8 text-green-500 dark:text-green-400" />
        </div>
      )}
      <div
        className={`max-w-[80%] px-4 py-2 ${style} ${
          isUser
            ? 'bg-green-500 dark:bg-green-600 text-white'
            : 'bg-green-100 dark:bg-gray-700 text-green-800 dark:text-green-200'
        } shadow-md transition-all duration-200 ease-in-out hover:shadow-lg rounded-lg`}
      >
        <ReactMarkdown
          className="text-sm sm:text-base prose dark:prose-invert max-w-none"
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '')
              return !inline && match ? (
                <div className="relative">
                  <SyntaxHighlighter
                    style={tomorrow}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                    className="rounded-md !bg-gray-100 dark:!bg-gray-900"
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <code className={`${className} bg-gray-100 dark:bg-gray-900 px-1 py-0.5 rounded`} {...props}>
                  {children}
                </code>
              )
            },
            h1: ({ node, ...props }) => <h1 className="text-xl font-bold mt-3 mb-2" {...props} />,
            h2: ({ node, ...props }) => <h2 className="text-lg font-bold mt-2 mb-1" {...props} />,
            h3: ({ node, ...props }) => <h3 className="text-base font-bold mt-2 mb-1" {...props} />,
            p: ({ node, ...props }) => <p className="mb-2" {...props} />,
            ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2" {...props} />,
            ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2" {...props} />,
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-green-500 dark:border-green-400 pl-3 py-1 italic" {...props} />
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
      {isUser && (
        <div className="ml-2 mb-1">
          <User className="w-8 h-8 text-green-500 dark:text-green-400" />
        </div>
      )}
    </div>
  )
}

export default MessageBubble
