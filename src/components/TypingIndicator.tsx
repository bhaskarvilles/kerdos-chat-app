import React from 'react'

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-4 bg-gray-50 dark:bg-gray-800/50 py-8">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-sm bg-teal-600 flex items-center justify-center text-white">
          AI
        </div>
      </div>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  )
}

export default TypingIndicator