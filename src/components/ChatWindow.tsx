import React from 'react'
import { Message, UserPreferences } from '../types'
import MessageBubble from './MessageBubble'
import LoadingBubble from './LoadingBubble'
import { motion, AnimatePresence } from 'framer-motion'

interface ChatWindowProps {
  messages: Message[]
  onSendMessage: (content: string) => Promise<void>
  isLoading: boolean
  preferences: UserPreferences
  className?: string
}

const ChatWindow: React.FC<ChatWindowProps> = ({ 
  messages, 
  isLoading, 
  className = '' 
}) => {
  return (
    <div className={`h-full overflow-y-auto p-4 ${className}`}>
      <AnimatePresence>
        {messages?.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <MessageBubble message={message} />
          </motion.div>
        ))}
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <LoadingBubble />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatWindow
