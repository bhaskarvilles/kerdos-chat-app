import React, { useState, useRef, useEffect } from 'react'
import ChatWindow from './ChatWindow'
import MessageInput from './MessageInput'
import TopicSuggestions from './TopicSuggestions'
import ChatbotCustomizer from './ChatbotCustomizer'
import UserSettings from './UserSettings'
import { Message, User, Chatbot, UserPreferences } from '../types'
import { LogOut, Settings, Sun, Moon, Download } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { getAIResponse } from '../services/aiChatService'

interface ChatInterfaceProps {
  user: User
  onSignOut: () => void
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, onSignOut }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [chatbots, setChatbots] = useState<Chatbot[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    fontSize: 'medium',
    messageDisplay: 'bubbles',
  })
  const chatWindowRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async (content: string) => {
    const newUserMessage: Message = {
      id: Date.now(),
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
      username: user.username,
    }
    setMessages((prevMessages) => [...prevMessages, newUserMessage])
    setIsLoading(true)

    try {
      const aiResponse = await getAIResponse(content)
      const newAIMessage: Message = {
        id: Date.now() + 1,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        username: 'AI Assistant',
      }
      setMessages((prevMessages) => [...prevMessages, newAIMessage])
      
      const newSuggestions = generateSuggestions(aiResponse)
      setSuggestions(newSuggestions)
    } catch (error) {
      console.error('Error getting AI response:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const handleCreateChatbot = (name: string, personality: string) => {
    const newChatbot: Chatbot = {
      id: String(chatbots.length + 1),
      name,
      personality,
    }
    setChatbots([...chatbots, newChatbot])
    setIsCustomizing(false)
  }

  const generateSuggestions = (aiResponse: string): string[] => {
    const words = aiResponse.split(' ')
    const randomWords = words
      .filter(word => word.length > 4)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
    return randomWords.map(word => `Tell me more about ${word}`)
  }

  const handleExportChat = () => {
    const chatContent = messages.map(msg => `${msg.username} (${msg.timestamp}): ${msg.content}`).join('\n\n')
    const blob = new Blob([chatContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chat_export.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleUpdatePreferences = (newPreferences: Partial<UserPreferences>) => {
    setUserPreferences(prev => ({ ...prev, ...newPreferences }))
  }

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
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>
      <div className="flex-grow flex flex-col overflow-hidden">
        <ChatWindow 
          ref={chatWindowRef} 
          messages={messages} 
          isLoading={isLoading} 
          preferences={userPreferences}
        />
        <TopicSuggestions suggestions={suggestions} onSuggestionClick={handleSuggestionClick} />
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
        />
      )}
    </div>
  )
}

export default ChatInterface