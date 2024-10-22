import React, { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Chat } from '../types'

interface ChatTabsProps {
  chats: Chat[]
  activeChat: string
  onChatChange: (chatId: string) => void
  onNewChat: () => void
  onCloseChat: (chatId: string) => void
}

const ChatTabs: React.FC<ChatTabsProps> = ({ chats, activeChat, onChatChange, onNewChat, onCloseChat }) => {
  return (
    <nav className="flex items-center space-x-2 p-2 bg-green-100 dark:bg-green-800 overflow-x-auto" aria-label="Chat tabs">
      {chats.map((chat) => (
        <ChatTab
          key={chat.id}
          chat={chat}
          isActive={chat.id === activeChat}
          onChatChange={onChatChange}
          onCloseChat={onCloseChat}
          showCloseButton={chats.length > 1}
        />
      ))}
      <NewChatButton onNewChat={onNewChat} />
    </nav>
  )
}

interface ChatTabProps {
  chat: Chat
  isActive: boolean
  onChatChange: (chatId: string) => void
  onCloseChat: (chatId: string) => void
  showCloseButton: boolean
}

const ChatTab: React.FC<ChatTabProps> = ({ chat, isActive, onChatChange, onCloseChat, showCloseButton }) => {
  const [tabName, setTabName] = useState(chat.name)

  useEffect(() => {
    // Update tab name based on chat content
    if (chat.messages.length > 0) {
      const lastMessage = chat.messages[chat.messages.length - 1]
      setTabName(lastMessage.content.slice(0, 20) + (lastMessage.content.length > 20 ? '...' : ''))
    } else {
      setTabName(chat.name)
    }
  }, [chat.messages, chat.name])

  const baseClasses = "flex items-center px-3 py-1 rounded-full cursor-pointer transition-all duration-300 ease-in-out"
  const activeClasses = "bg-white dark:bg-gray-700 text-green-800 dark:text-green-200 shadow-md transform scale-105"
  const inactiveClasses = "bg-green-200 dark:bg-green-700 text-green-700 dark:text-green-300 hover:bg-green-300 dark:hover:bg-green-600 hover:shadow-sm"

  return (
    <button
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={() => onChatChange(chat.id)}
      aria-selected={isActive}
      role="tab"
    >
      <span className="truncate max-w-xs">{tabName}</span>
      {showCloseButton && (
        <CloseButton onClose={() => onCloseChat(chat.id)} />
      )}
    </button>
  )
}

interface CloseButtonProps {
  onClose: () => void
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => (
  <button
    className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
    onClick={(e) => {
      e.stopPropagation()
      onClose()
    }}
    aria-label="Close chat"
  >
    <X size={16} />
  </button>
)

const NewChatButton: React.FC<{ onNewChat: () => void }> = ({ onNewChat }) => (
  <button
    className="flex items-center justify-center w-8 h-8 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors duration-200"
    onClick={onNewChat}
    aria-label="New chat"
  >
    <Plus size={20} />
  </button>
)

export default ChatTabs
