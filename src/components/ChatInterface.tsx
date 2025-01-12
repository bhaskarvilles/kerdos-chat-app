import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import ChatWindow from './ChatWindow'
import MessageInput from './MessageInput'
import TopicSuggestions from './TopicSuggestions'
import UserSettings from './UserSettings'
import { Message, User, Chat, UserPreferences, Chatbot } from '../types'
import { LogOut, Settings, Sun, Moon, Download, AlertCircle } from 'lucide-react'
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar with responsive behavior */}
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onChatSelect={handleChatChange}
        onNewChat={handleNewChat}
        onDeleteChat={handleCloseChat}
        onSignOut={onSignOut}
        onExportChat={handleExportChat}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        theme={theme}
        userPreferences={userPreferences}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className={`transition-all duration-300 ease-in-out
          ${isSidebarCollapsed ? 'w-20' : 'w-72'} 
          flex-shrink-0 shadow-xl z-10 
          md:relative md:translate-x-0
          ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}
        `}
      />
      
      {/* Main chat container with max-width and auto-scaling */}
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="flex flex-col h-full max-w-6xl w-full mx-auto">
          {/* Header - Fixed height */}
          <div className="h-16 flex items-center justify-between px-4 sm:px-6 
            bg-white/80 dark:bg-gray-800/90 backdrop-blur-md 
            border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-4 min-w-0">
              <h1 className="text-lg font-semibold bg-gradient-to-r from-violet-500 to-fuchsia-500 
                text-transparent bg-clip-text truncate">
                {activeChatData.name}
              </h1>
              {isPaidUser && (
                <span className="flex-shrink-0 px-2 py-1 text-xs font-medium 
                  text-emerald-700 dark:text-emerald-400 
                  bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                  Pro
                </span>
              )}
            </div>
            {error && (
              <div className="flex-shrink-0 flex items-center px-4 py-2 
                bg-red-50 dark:bg-red-900/30 rounded-lg 
                border border-red-200 dark:border-red-800">
                <AlertCircle size={16} className="mr-2 text-red-500" />
                <span className="text-sm text-red-600 dark:text-red-400">{error}</span>
              </div>
            )}
          </div>

          {/* Chat window - Flexible height with padding */}
          <div className="flex-1 overflow-hidden bg-white/50 dark:bg-gray-800/50">
            <div className="h-full px-4 sm:px-6">
              <ChatWindow
                ref={chatWindowRef}
                messages={activeChatData.messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                preferences={userPreferences}
                className="h-full max-w-4xl mx-auto py-6 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Input area - Fixed position at bottom */}
          <div className="border-t border-gray-200/50 dark:border-gray-700/50 
            bg-white/80 dark:bg-gray-800/90 backdrop-blur-md">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <TopicSuggestions
                suggestions={suggestions}
                onSuggestionClick={handleSuggestionClick}
                onHideSuggestions={handleHideSuggestions}
              />
              <div className="py-4">
                <MessageInput
                  onSendMessage={handleSendMessage}
                  className="bg-white dark:bg-gray-900 shadow-lg rounded-xl 
                    border border-gray-200/50 dark:border-gray-700/50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal - Centered with max-width */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 
          flex items-center justify-center p-4">
          <UserSettings
            preferences={userPreferences}
            onUpdatePreferences={handleUpdatePreferences}
            onClose={() => setIsSettingsOpen(false)}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl 
              max-w-md w-full mx-auto"
          />
        </div>
      )}

      {/* Toast Messages - Fixed position */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
          type="error"
          className="fixed bottom-4 right-4 z-50"
        />
      )}
    </div>
  );
};

export default React.memo(ChatInterface);
