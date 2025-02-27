import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Mic, Hash, Image, Plus } from 'lucide-react'

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>
  onAttachment?: (file: File) => void
  className?: string
  suggestions?: string[]
  disabled?: boolean
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  onAttachment,
  className = '',
  suggestions,
  disabled = false
}) => {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showTools, setShowTools] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const toolsRef = useRef<HTMLDivElement>(null)

  // Handle click outside tools menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setShowTools(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      await onSendMessage(message.trim())
      setMessage('')
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
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
      className={`relative max-w-3xl mx-auto ${className}`}
    >
      {/* Tools Menu */}
      {showTools && (
        <div 
          ref={toolsRef}
          className="absolute bottom-full mb-2 left-0 bg-white dark:bg-gray-800 
            rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-2"
        >
          <div className="flex flex-col gap-1">
            <button 
              type="button"
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 
                dark:hover:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300"
            >
              <Hash className="w-4 h-4" />
              <span>Web Search</span>
            </button>
            <button 
              type="button"
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 
                dark:hover:bg-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-300"
            >
              <Image className="w-4 h-4" />
              <span>Generate Image</span>
            </button>
          </div>
        </div>
      )}

      <div className="flex items-end space-x-2 p-4">
        {/* Tools Button */}
        <button
          type="button"
          onClick={() => setShowTools(!showTools)}
          className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300
            hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>

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
            placeholder="Message AI Assistant..."
            className="w-full p-4 pr-24 rounded-lg border border-gray-200 dark:border-gray-700 
              focus:outline-none focus:border-teal-500 dark:focus:border-teal-500
              resize-none bg-white dark:bg-gray-800"
            rows={1}
            disabled={disabled}
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="absolute right-2 bottom-2 p-2 rounded-lg 
              bg-teal-600 hover:bg-teal-700 text-white
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
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
