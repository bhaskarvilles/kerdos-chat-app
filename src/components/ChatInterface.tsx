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
import UserProfile from './UserProfile'

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
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(() => {
    const savedPreferences = localStorage.getItem('userPreferences');
    if (savedPreferences) {
      return JSON.parse(savedPreferences);
    }
    return DEFAULT_USER_PREFERENCES;
  });
  const [isPaidUser, setIsPaidUser] = useState(false)
  const [openAIKey, setOpenAIKey] = useState<string | null>(getOpenAIKey())
  const [error, setError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const chatWindowRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()
  const [isInitializing, setIsInitializing] = useState(true)
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

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
    setUserPreferences(prev => {
      const updated = { ...prev, ...newPreferences };
      localStorage.setItem('userPreferences', JSON.stringify(updated));
      return updated;
    });
  }, []);

  useEffect(() => {
    // Apply font size to messages container
    const messagesContainer = document.querySelector('.messages-container');
    if (messagesContainer) {
      messagesContainer.className = `messages-container ${
        userPreferences.fontSize === 'small' ? 'text-sm' :
        userPreferences.fontSize === 'large' ? 'text-lg' :
        'text-base'
      }`;
    }

    // Apply other preferences as needed
    if (userPreferences.enableNotifications) {
      // Request notification permissions if needed
      Notification.requestPermission();
    }
  }, [userPreferences]);

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

  const handleUpdateProfile = useCallback((updates: Partial<User>) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('chatUser', JSON.stringify(updatedUser));
  }, [user]);

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
    <div className="flex h-[100dvh] relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Sidebar with improved mobile handling */}
      <div 
        className={`
          absolute md:relative z-30 h-full
          ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}
          md:translate-x-0 
          ${isSidebarCollapsed ? 'w-0 md:w-20' : 'w-[280px]'}
          transition-all duration-300 ease-in-out
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg
          border-r border-gray-200/50 dark:border-gray-700/50
          flex flex-col
          md:flex
          ${isSidebarCollapsed ? 'md:flex' : 'flex'}
        `}
      >
        {/* New Chat Button */}
        <div className="p-4">
          <button 
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
              bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700
              text-white transition-all duration-200 shadow-lg hover:shadow-xl
              transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-5 h-5" />
            <span className={`font-medium ${isSidebarCollapsed ? 'hidden' : 'block'}`}>New Chat</span>
          </button>
        </div>

        {/* Search Chats with animation */}
        <div className="px-4 pb-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400
              transition-transform duration-200 group-focus-within:text-teal-500" />
            <input
              type="text"
              placeholder={isSidebarCollapsed ? '' : 'Search chats...'}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100/50 dark:bg-gray-700/50 
                rounded-xl text-sm transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white
                dark:focus:bg-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Chat List with hover effects */}
        <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => handleChatChange(chat.id)}
              className={`
                w-full text-left px-3 py-3 rounded-xl transition-all duration-200
                flex items-center gap-3 group hover:bg-gray-100/70 dark:hover:bg-gray-700/70
                ${activeChat === chat.id ? 'bg-gray-100/80 dark:bg-gray-700/80 shadow-sm' : ''}
                transform hover:scale-[1.01] active:scale-[0.99]
              `}
            >
              <MessageSquare 
                size={18} 
                className={`
                  transition-colors duration-200
                  ${activeChat === chat.id ? 'text-teal-500' : 'text-gray-400'}
                `} 
              />
              <div className={`flex-1 min-w-0 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
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

        {/* User Section with glass effect */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 
                flex items-center justify-center text-white shadow-lg">
                <UserIcon size={18} />
              </div>
              <div className={`flex-1 min-w-0 ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
                <button
                  onClick={() => setIsProfileOpen(true)}
                  className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate hover:text-teal-500 transition-colors"
                >
                  {user.username}
                </button>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {isPaidUser ? 'Pro Plan' : 'Free Plan'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all
                duration-200 hover:shadow-md active:scale-95"
            >
              <Settings size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {!isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setIsSidebarCollapsed(true)}
        />
      )}

      {/* Main Content with mobile optimizations */}
      <div className="flex-1 flex flex-col min-w-0 h-[100dvh] relative">
        {/* Header with mobile optimization */}
        <header className="h-14 md:h-16 flex items-center justify-between px-3 md:px-4 
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b 
          border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-10">
          <div className="flex items-center gap-2 md:gap-3">
            <button 
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl
                transition-all duration-200 hover:shadow-md active:scale-95"
            >
              <Menu size={18} className="text-gray-500" />
            </button>
            <h1 className="text-base md:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate max-w-[150px] md:max-w-none">
              {activeChatData.name}
            </h1>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl
                transition-all duration-200 hover:shadow-md active:scale-95"
            >
              {theme === 'light' ? (
                <Moon size={18} className="text-gray-500" />
              ) : (
                <Sun size={18} className="text-gray-400" />
              )}
            </button>
            <button
              onClick={() => handleExportChat('pdf')}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 text-sm text-gray-600 dark:text-gray-300
                hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200
                hover:shadow-md active:scale-95"
            >
              <Download size={16} />
              <span className="hidden md:inline">Export</span>
            </button>
          </div>
        </header>

        {/* Messages Area with fixed width and proper scaling */}
        <div 
          ref={chatWindowRef}
          className="flex-1 overflow-y-auto overflow-x-hidden w-full"
          style={{ 
            height: 'calc(100dvh - 120px)',
            overscrollBehavior: 'contain'
          }}
        >
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="space-y-6">
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
        </div>

        {/* Input Area with fixed width */}
        <div className="border-t border-gray-200/50 dark:border-gray-700/50 
          bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg w-full"
        >
          <div className="max-w-4xl mx-auto px-4 py-4">
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

      {/* UserProfile modal */}
      {isProfileOpen && (
        <UserProfile
          user={user}
          isPaidUser={isPaidUser}
          preferences={userPreferences}
          onUpdateProfile={handleUpdateProfile}
          onOpenSettings={() => {
            setIsProfileOpen(false);
            setIsSettingsOpen(true);
          }}
          onSignOut={onSignOut}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
};

export default React.memo(ChatInterface);
