import React from 'react'

const LoadingBubble: React.FC = () => {
  return (
    <div className="flex flex-col items-start mb-4">
      {/* Username placeholder */}
      <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
        AI Assistant is typing...
      </div>
      
      {/* Message Bubble with loading animation */}
      <div className="max-w-[80%] rounded-2xl px-4 py-3 shadow-sm
        bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 
        rounded-bl-none border border-gray-200/50 dark:border-gray-700/50"
      >
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default LoadingBubble
