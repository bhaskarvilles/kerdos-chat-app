import React, { forwardRef } from 'react'
import { Message, UserPreferences } from '../types'
import MessageBubble from './MessageBubble'

interface ChatWindowProps {
  messages: Message[]
  isLoading: boolean
  preferences: UserPreferences
}

const ChatWindow = forwardRef<HTMLDivElement, ChatWindowProps>(({ messages, isLoading, preferences }, ref) => {
  const messageStyle = preferences.messageDisplay === 'bubbles' ? 'rounded-lg' : 'border-b'

  return (
    <div 
      ref={ref} 
      className={`flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 ${
        preferences.fontSize === 'large' ? 'text-lg' : 'text-base'
      }`}
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} style={messageStyle} />
      ))}
      {isLoading && (
        <div className="flex justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-green-400 h-3 w-3 animate-bounce"></div>
            <div className="rounded-full bg-green-400 h-3 w-3 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <div className="rounded-full bg-green-400 h-3 w-3 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      )}
    </div>
  )
})

ChatWindow.displayName = 'ChatWindow'

export default ChatWindow