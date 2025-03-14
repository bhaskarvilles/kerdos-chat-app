import React, { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"

interface MessageInputProps {
  onSendMessage: (content: string) => Promise<void>
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    
    await onSendMessage(message)
    setMessage('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2">
      <div className="flex-1 relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="min-h-[60px] max-h-[200px] resize-none"
        />
      </div>
      <Button type="submit" size="icon" className="h-10 w-10">
        <Send className="h-5 w-5" />
      </Button>
    </form>
  )
}

export default MessageInput
