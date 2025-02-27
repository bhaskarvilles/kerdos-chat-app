import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import ChatWindow from './ChatWindow'
import MessageInput from './MessageInput'
import TopicSuggestions from './TopicSuggestions'
import UserSettings from './UserSettings'
import { Message, User, Chat, UserPreferences, Chatbot } from '../types'
import { LogOut, Settings, Sun, Moon, Download, AlertCircle, Menu, MessageSquare, User as UserIcon, Plus, Search } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { getAIResponse } from '../services/aiChatService'
import { initializeOpenAI, getOpenAIResponse } from '../services/openAiService'
import { checkUserPaidStatus, saveOpenAIKey, getOpenAIKey } from '../services/userService'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { CHAT_STORAGE_KEY, USER_PREFERENCES_KEY, DEFAULT_USER_PREFERENCES, NEW_CHAT_NAME } from '../constants'
import Toast from './Toast'
import Sidebar from './Sidebar'
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'

interface ChatInterfaceProps {
  user: User;
  onSignOut: () => void;
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
  const [isInitializing, setIsInitializing] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkUserPaidStatus(user.username).then(setIsPaidUser)
      } catch (error) {
        console.error('Error initializing app:', error)
        setToastMessage('Failed to initialize app settings')
      } finally {
        setIsInitializing(false)
      }
    }
    
    initializeApp()
  }, [user.username])

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [chats, activeChat])

  const handleSendMessage = useCallback(async (content: string) => {
    const timestamp = new Date().toISOString(); // Use ISO string format
    
    const newUserMessage: Message = {
      id: String(Date.now()),
      content,
      role: 'user',
      timestamp,
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
        id: String(Date.now() + 1),
        content: aiResponse,
        role: 'assistant',
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

  const handleExportChat = useCallback(async (format: 'txt' | 'pdf' = 'txt') => {
    const activeMessages = chats.find(chat => chat.id === activeChat)?.messages || [];
    const chatName = chats.find(chat => chat.id === activeChat)?.name || 'chat';
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'pdf') {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text(chatName, 20, 20);
      
      // Prepare message data
      const messageData = activeMessages.map(msg => [
        msg.username,
        new Date(msg.timestamp).toLocaleString(),
        msg.content
      ]);
      
      // Add messages table
      doc.autoTable({
        startY: 30,
        head: [['User', 'Time', 'Message']],
        body: messageData,
        styles: {
          fontSize: userPreferences.fontSize === 'large' ? 12 : 
                   userPreferences.fontSize === 'small' ? 8 : 10,
          cellPadding: 3,
        },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 40 },
          2: { cellWidth: 'auto' }
        },
        margin: { top: 30 },
        theme: theme === 'dark' ? 'grid' : 'striped',
      });
      
      doc.save(`${chatName}_${timestamp}.pdf`);
    } else {
      // Original txt export logic
      const chatContent = activeMessages.map(msg => 
        `${msg.username} (${new Date(msg.timestamp).toLocaleString()}): ${msg.content}`
      ).join('\n\n');
      
      const blob = new Blob([chatContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${chatName}_${timestamp}.txt`;
      a.click();
      
      URL.revokeObjectURL(url);
    }
  }, [activeChat, chats, theme, userPreferences.fontSize]);

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

  // Memoize complex computations
  const activeChatData = useMemo(() => ({
    messages: chats.find((chat: Chat) => chat.id === activeChat)?.messages || [],
    name: chats.find(chat => chat.id === activeChat)?.name || 'New Chat'
  }), [activeChat, chats]);

  // Show loading state
  if (isInitializing) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
          <p className="text-gray-600 dark:text-gray-300">Initializing...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div 
        className={`
          ${isSidebarCollapsed ? 'w-0 opacity-0' : 'w-80 opacity-100'} 
          transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 
          dark:border-gray-700 flex flex-col overflow-hidden
        `}
      >
        {/* New Chat Button */}
        <div className="p-4">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg
              bg-teal-600 hover:bg-teal-700 text-white transition-colors duration-200"
          >
            <Plus size={20} />
            <span className="font-medium">New Chat</span>
          </button>
        </div>

        {/* Search Chats */}
        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg
                text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => handleChatChange(chat.id)}
              className={`
                w-full text-left px-3 py-3 rounded-lg transition-colors duration-200
                flex items-center gap-3 group hover:bg-gray-100 dark:hover:bg-gray-700
                ${activeChat === chat.id ? 'bg-gray-100 dark:bg-gray-700' : ''}
              `}
            >
              <MessageSquare 
                size={18} 
                className={`
                  ${activeChat === chat.id ? 'text-teal-600' : 'text-gray-400'}
                `} 
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                  {chat.name}
                </p>
                <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                  {chat.messages[chat.messages.length - 1]?.content.substring(0, 30) || 'No messages yet'}...
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* User Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white">
                <UserIcon size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user.username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isPaidUser ? 'Pro Plan' : 'Free Plan'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Settings size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Menu size={20} className="text-gray-500" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {activeChatData.name}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <Moon size={20} className="text-gray-500" />
              ) : (
                <Sun size={20} className="text-gray-400" />
              )}
            </button>
            <button
              onClick={() => handleExportChat('pdf')}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div 
          ref={chatWindowRef}
          className="flex-1 overflow-y-auto px-4 py-6"
        >
          <div className="max-w-3xl mx-auto space-y-6">
            {activeChatData.messages.map((message, index) => (
              <MessageBubble
                key={message.id || index}
                message={message}
                preferences={userPreferences}
                isLast={index === activeChatData.messages.length - 1}
              />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="max-w-3xl mx-auto p-4">
            <MessageInput
              onSendMessage={handleSendMessage}
              suggestions={suggestions}
              disabled={isLoading}
            />
            <p className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
              AI Assistant may produce inaccurate information
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isSettingsOpen && (
        <UserSettings
          preferences={userPreferences}
          onUpdatePreferences={handleUpdatePreferences}
          onClose={() => setIsSettingsOpen(false)}
          isPaidUser={isPaidUser}
          onOpenAIKeySubmit={handleOpenAIKeySubmit}
        />
      )}

      {/* Toast Messages */}
      {toastMessage && (
        <Toast 
          message={toastMessage}
          type={error ? 'error' : 'info'}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default React.memo(ChatInterface);
