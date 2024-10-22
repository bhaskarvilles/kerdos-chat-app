import React, { forwardRef, useEffect, useRef } from 'react'
import { Message, UserPreferences } from '../types'
import MessageBubble from './MessageBubble'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatWindowProps {
  messages: Message[]
  isLoading: boolean
  preferences: UserPreferences
}

const ChatWindow = forwardRef<HTMLDivElement, ChatWindowProps>(({ messages, isLoading, preferences }, ref) => {
  const messageStyle = preferences.messageDisplay === 'bubbles' ? 'rounded-2xl' : 'rounded-lg'
  const endOfMessagesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div 
      ref={ref} 
      className={`flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 ${
        preferences.fontSize === 'large' ? 'text-lg' : 'text-base'
      }`}
    >
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MessageBubble message={message} style={messageStyle} />
          </motion.div>
        ))}
      </AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="flex justify-center"
        >
          <div className="flex space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="rounded-full bg-green-400 h-3 w-3"
                animate={{
                  y: [0, -10, 0],
                  transition: {
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.2,
                  },
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  )
})

ChatWindow.displayName = 'ChatWindow'

export default ChatWindow
