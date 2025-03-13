import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Mic, Hash, Image, Plus, Wrench } from 'lucide-react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card } from "./ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"

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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!message.trim() || isSubmitting) return
    
    try {
      setIsSubmitting(true)
      await onSendMessage(message.trim())
      setMessage('')
    } finally {
      setIsSubmitting(false)
      textareaRef.current?.focus()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && onAttachment) {
      onAttachment(file)
    }
  }

  const handleVoiceInput = () => {
    setIsRecording(!isRecording)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-end gap-2">
        {/* Tools button */}
        <Popover open={showTools} onOpenChange={setShowTools}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 sm:h-10 sm:w-10"
            >
              <Wrench className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-2">
            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setShowTools(false);
                  // Add your tool action here
                }}
              >
                <Wrench className="h-4 w-4" />
                Tool 1
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => {
                  setShowTools(false);
                  // Add your tool action here
                }}
              >
                <Wrench className="h-4 w-4" />
                Tool 2
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* File attachment button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-10 sm:w-10"
          onClick={() => fileInputRef.current?.click()}
        >
          <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept=".txt,.pdf,.doc,.docx"
        />

        {/* Message input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[40px] max-h-[200px] pr-12 py-2 text-sm sm:text-base resize-none"
            rows={1}
          />
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <span className="text-xs text-muted-foreground">
              {message.length}/4000
            </span>
            <Button
              type="submit"
              size="icon"
              className="h-6 w-6 sm:h-8 sm:w-8"
              disabled={isSubmitting || !message.trim()}
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        {/* Voice input button */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 sm:h-10 sm:w-10",
            isRecording && "text-red-500"
          )}
          onClick={handleVoiceInput}
        >
          <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>
    </form>
  )
}

export default MessageInput
