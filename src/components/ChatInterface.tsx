import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import ChatWindow from './ChatWindow'
import MessageInput from './MessageInput'
import TopicSuggestions from './TopicSuggestions'
import ChatbotCustomizer from './ChatbotCustomizer'
import UserSettings from './UserSettings'
import ChatTabs from './ChatTabs'
import { Message, User, Chatbot, UserPreferences, Chat } from '../types'
import { LogOut, Settings, Sun, Moon, Download, AlertCircle } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { getAIResponse } from '../services/aiChatService'
import { initializeOpenAI, getOpenAIResponse } from '../services/openAiService'
import { checkUserPaidStatus, saveOpenAIKey, getOpenAIKey } from '../services/userService'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { CHAT_STORAGE_KEY, USER_PREFERENCES_KEY, DEFAULT_USER_PREFERENCES, NEW_CHAT_NAME } from '../constants'
import LoadingIndicator from './LoadingIndicator'
import Toast from './Toast'

interface ChatInterfaceProps {
  user: User
  onSignOut: () => void
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, onSignOut }) => {
  const [chats, setChats] = useLocalStorage<Chat[]>(CHAT_STORAGE_KEY, [{ id: '1', name: NEW_CHAT_NAME, messages: [] }])
  const [activeChat, setActiveChat] = useState<string>(chats[0].id)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userPreferences, setUserPreferences] = useLocalStorage<UserPreferences>(USER_PREFERENCES_KEY, DEFAULT_USER_PREFERENCES)
  const [isPaidUser, setIsPaidUser] = useState(false)
  const [openAIKey, setOpenAIKey] = useState<string | null>(getOpenAIKey())
  const [error, setError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const chatWindowRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    checkUserPaidStatus(user.username).then(setIsPaidUser)
  }, [user.username])

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [chats, activeChat])

  const handleSendMessage = useCallback(async (content: string) => {
    const newUserMessage: Message = {
      id: Date.now(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      username: user.username,
    }
    
    setChats((prevChats: Chat[]) => prevChats.map((chat: Chat) => 
      chat.id === activeChat 
        ? { ...chat, messages: [...chat.messages, newUserMessage] }
        : chat
    ))
    
    setIsLoading(true)
    setError(null)

    try {
      let aiResponse: string
      if (isPaidUser && openAIKey) {
        initializeOpenAI(openAIKey)
        aiResponse = await getOpenAIResponse(content)
      } else {
        aiResponse = await getAIResponse(content)
      }
      
      const newAIMessage: Message = {
        id: Date.now() + 1,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        username: 'AI Assistant',
      }
      
      setChats((prevChats: Chat[]) => prevChats.map((chat: Chat) => 
        chat.id === activeChat 
          ? { ...chat, messages: [...chat.messages, newAIMessage] }
          : chat
      ))
      
      const newSuggestions = generateSuggestions(aiResponse)
      setSuggestions(newSuggestions)
    } catch (error) {
      console.error('Error getting AI response:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      setError(errorMessage)
      setToastMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [activeChat, isPaidUser, openAIKey, user.username, setChats])

  const handleSuggestionClick = useCallback((suggestion: string) => {
    handleSendMessage(suggestion)
  }, [handleSendMessage])

  const handleCreateChatbot = useCallback((name: string, personality: string) => {
    const newChatbot: Chatbot = {
      id: String(chatbots.length + 1),
      name,
      personality,
    }
    setChatbots(prev => [...prev, newChatbot])
    setIsCustomizing(false)
  }, [chatbots.length])

  const generateSuggestions = useCallback((aiResponse: string): string[] => {
    const words = aiResponse.split(' ')
    const randomWords = words
      .filter(word => word.length > 4)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    return randomWords.map(word => `Tell me more about ${word}`)
  }, [])

  const handleExportChat = useCallback(() => {
    const activeMessages = chats.find(chat => chat.id === activeChat)?.messages || []
    const chatContent = activeMessages.map(msg => `${msg.username} (${msg.timestamp}): ${msg.content}`).join('\n\n')
    const blob = new Blob([chatContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chat_export.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [activeChat, chats])

  const handleUpdatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    setUserPreferences((prev: UserPreferences) => ({ ...prev, ...newPreferences }))
  }, [setUserPreferences])

  const handleNewChat = useCallback(() => {
    const newChat: Chat = {
      id: Date.now().toString(),
      name: `${NEW_CHAT_NAME} ${chats.length + 1}`,
      messages: []
    }
    setChats((prev: Chat[]) => [...prev, newChat])
    setActiveChat(newChat.id)
  }, [chats.length, setChats])

  const handleCloseChat = useCallback((chatId: string) => {
    if (chats.length > 1) {
      setChats((prev: Chat[]) => {
        const newChats = prev.filter((chat: Chat) => chat.id !== chatId)
        if (activeChat === chatId) {
          setActiveChat(newChats[newChats.length - 1].id)
        }
        return newChats
      })
    }
  }, [activeChat, chats.length, setChats])

  const handleChatChange = useCallback((chatId: string) => {
    setActiveChat(chatId)
  }, [])

  const handleHideSuggestions = useCallback(() => {
    setSuggestions([])
  }, [])

  const handleOpenAIKeySubmit = useCallback((key: string) => {
    setOpenAIKey(key)
    saveOpenAIKey(key)
    initializeOpenAI(key)
  }, [])

  const activeMessages = useMemo(() => chats.find((chat: Chat) => chat.id === activeChat)?.messages || [], [activeChat, chats])

  return (
    <div className="flex flex-col h-screen max-w-4xl w-full mx-auto bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-500 dark:from-green-700 dark:to-green-600 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          Kerdos AI Chat
        </h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportChat}
            className="p-2 rounded-full bg-green-400 hover:bg-green-300 dark:bg-green-500 dark:hover:bg-green-400 text-white transition-colors duration-200"
            aria-label="Export chat"
          >
            <Download size={20} />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-green-400 hover:bg-green-300 dark:bg-green-500 dark:hover:bg-green-400 text-white transition-colors duration-200"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-full bg-green-400 hover:bg-green-300 dark:bg-green-500 dark:hover:bg-green-400 text-white transition-colors duration-200"
            aria-label="User settings"
          >
            <Settings size={20} />
          </button>
          <button
            onClick={onSignOut}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 flex items-center"
            style={{
              transform: 'translateY(0)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
      <ChatTabs
        chats={chats}
        activeChat={activeChat}
        onChatChange={handleChatChange}
        onNewChat={handleNewChat}
        onCloseChat={handleCloseChat}
      />
      <div className="flex-grow flex flex-col overflow-hidden relative">
        <ChatWindow 
          ref={chatWindowRef} 
          messages={activeMessages} 
          isLoading={isLoading} 
          preferences={userPreferences}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <LoadingIndicator />
          </div>
        )}
        <TopicSuggestions 
          suggestions={suggestions} 
          onSuggestionClick={handleSuggestionClick} 
          onHideSuggestions={handleHideSuggestions}
        />
        <MessageInput onSendMessage={handleSendMessage} />
      </div>
      {isCustomizing && (
        <ChatbotCustomizer
          onClose={() => setIsCustomizing(false)}
          onCreateChatbot={handleCreateChatbot}
        />
      )}
      {isSettingsOpen && (
        <UserSettings
          preferences={userPreferences}
          onUpdatePreferences={handleUpdatePreferences}
          onClose={() => setIsSettingsOpen(false)}
          isPaidUser={isPaidUser}
          onOpenAIKeySubmit={handleOpenAIKeySubmit}
        />
      )}
      {toastMessage && (
        <Toast 
          message={toastMessage} 
          type="error" 
          onClose={() => setToastMessage(null)} 
        />
      )}
    </div>
  )
}

export default React.memo(ChatInterface)
