import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Mic } from 'lucide-react'

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>
  onAttachment?: (file: File) => void
  className?: string
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  onAttachment,
  className = '' 
}) => {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      try {
        await onSendMessage(message.trim())
        setMessage('')
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto'
        }
      } catch (error) {
        console.error('Failed to send message:', error)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onAttachment) {
      onAttachment(file)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`relative bg-white dark:bg-gray-800 shadow-lg rounded-2xl ${className}`}
    >
      <div className="flex items-end space-x-2 p-4">
        {/* File attachment button */}
        <label className="cursor-pointer p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
          />
          <Paperclip className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </label>

        {/* Message input */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="w-full p-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 
              focus:outline-none focus:ring-2 focus:ring-violet-500 dark:focus:ring-violet-400 
              bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white resize-none
              placeholder-gray-500 dark:placeholder-gray-400
              transition-all duration-200"
            rows={1}
            style={{ maxHeight: '150px' }}
          />
          <button
            type="submit"
            className={`absolute right-2 bottom-2 p-2 rounded-lg transition-all duration-200
              ${message.trim() 
                ? 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
              }`}
            disabled={!message.trim()}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Voice input button */}
        <button
          type="button"
          onClick={() => setIsRecording(!isRecording)}
          className={`p-2 rounded-xl transition-all duration-200 ${
            isRecording 
              ? 'bg-red-500 text-white animate-pulse'
              : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400'
          }`}
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      {/* Keyboard shortcuts */}
      <div className="px-4 pb-3 flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <kbd className="px-2 py-1 font-medium bg-gray-100 dark:bg-gray-800 rounded-lg">
            Enter
          </kbd>
          <span>to send</span>
        </div>
        <span>•</span>
        <div className="flex items-center space-x-1">
          <kbd className="px-2 py-1 font-medium bg-gray-100 dark:bg-gray-800 rounded-lg">
            Shift + Enter
          </kbd>
          <span>for new line</span>
        </div>
      </div>
    </form>
  )
}

export default MessageInput
