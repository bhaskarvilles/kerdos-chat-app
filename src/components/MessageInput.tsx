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
            rounded-lg shadow-lg border border-emerald-200 dark:border-emerald-800 p-2"
        >
          <div className="flex flex-col gap-1">
            <button 
              type="button"
              className="flex items-center gap-2 px-3 py-2 hover:bg-emerald-50 
                dark:hover:bg-emerald-900/20 rounded-md text-sm text-gray-700 dark:text-gray-300"
            >
              <Hash className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
              <span>Web Search</span>
            </button>
            <button 
              type="button"
              className="flex items-center gap-2 px-3 py-2 hover:bg-emerald-50 
                dark:hover:bg-emerald-900/20 rounded-md text-sm text-gray-700 dark:text-gray-300"
            >
              <Image className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
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
          className="p-2 text-emerald-500 dark:text-emerald-400 hover:text-emerald-600 dark:hover:text-emerald-300
            hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>

        {/* File attachment button */}
        <label className="cursor-pointer p-2 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-xl transition-colors">
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,.pdf,.doc,.docx"
          />
          <Paperclip className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
        </label>

        {/* Message input */}
        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message AI Assistant..."
            className="w-full p-4 pr-24 rounded-lg border border-emerald-200 dark:border-emerald-800 
              focus:outline-none focus:border-emerald-500 dark:focus:border-emerald-500
              resize-none bg-white dark:bg-gray-800"
            rows={1}
            disabled={disabled}
          />
          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="absolute right-2 bottom-2 p-2 rounded-lg 
              bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white
              disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
              : 'hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400'
          }`}
        >
          <Mic className="w-5 h-5" />
        </button>
      </div>

      {/* Keyboard shortcuts */}
      <div className="px-4 pb-3 flex items-center justify-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <kbd className="px-2 py-1 font-medium bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
            Enter
          </kbd>
          <span>to send</span>
        </div>
        <span>•</span>
        <div className="flex items-center space-x-1">
          <kbd className="px-2 py-1 font-medium bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
            Shift + Enter
          </kbd>
          <span>for new line</span>
        </div>
      </div>
    </form>
  )
}

export default MessageInput
