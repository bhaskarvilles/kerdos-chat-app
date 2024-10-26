import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { MicrophoneIcon } from '@heroicons/react/solid'

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>
  onAttachment?: (file: File) => void
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, onAttachment }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message... (Hit Enter to send)"
            className="w-full p-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
            rows={1}
            style={{ minHeight: '50px', maxHeight: '150px' }}
          />
          <button
            type="submit"
            className="absolute right-2 bottom-2 bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors duration-200 flex items-center justify-center w-8 h-8"
            disabled={!message.trim()}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex items-center mt-2 space-x-1">
        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">Enter</kbd>
        <span className="text-xs text-gray-500 dark:text-gray-400">to send,</span>
        <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600">Shift + Enter</kbd>
        <span className="text-xs text-gray-500 dark:text-gray-400">for a new line</span>
      </div>
    </form>
  )
}

export default MessageInput
