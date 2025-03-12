import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import ChatWindow from './ChatWindow'
import MessageInput from './MessageInput'
import TopicSuggestions from './TopicSuggestions'
import UserSettings from './UserSettings'
import { Message, Chat, UserPreferences, Chatbot, UserProfile, UserSubscription } from '../types'
import { LogOut, Settings, Sun, Moon, Download, AlertCircle, Menu, MessageSquare, User as UserIcon, Plus, Search } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { getAIResponse } from '../services/aiChatService'
import { getOpenAIResponse, formatChatHistoryForOpenAI } from '../services/openAiService'
import { getUserProfile, getUserSubscription, updateUserProfile } from '../services/authService'
import { canSendMessage, getRemainingMessages, formatTimeUntilReset, getTimeUntilReset } from '../services/subscriptionService'
import { trackMessageUsage } from '../services/apiProxy'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { CHAT_STORAGE_KEY, USER_PREFERENCES_KEY, DEFAULT_USER_PREFERENCES, NEW_CHAT_NAME } from '../constants'
import Toast from './Toast'
import Sidebar from './Sidebar'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { exportToPDF } from '../utils/pdfUtils'
import MessageBubble from './MessageBubble'
import TypingIndicator from './TypingIndicator'
import UserProfileComponent from './UserProfile'
import SubscriptionInfo from './SubscriptionInfo'

// Add the autoTable type to jsPDF
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const ChatInterface: React.FC = () => {
  const { user, signOut, isUsingMockService } = useAuth();
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
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userSubscription, setUserSubscription] = useState<UserSubscription | null>(null);
  const [isPaidUser, setIsPaidUser] = useState(false)
  const [canSendMoreMessages, setCanSendMoreMessages] = useState(true)
  const [remainingMessages, setRemainingMessages] = useState<number | null>(null)
  const [timeUntilReset, setTimeUntilReset] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null)
  const { theme, toggleTheme } = useTheme()
  const isDarkMode = theme === 'dark';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  // Load user profile and subscription data
  useEffect(() => {
    const loadUserData = async () => {
      if (user) {
        try {
          // Load user profile
          const { profile, error: profileError } = await getUserProfile(user.id);
          if (profileError) {
            console.error('Error loading user profile:', profileError);
          } else {
            setUserProfile(profile);
          }
          
          // Load user subscription
          const { subscription, error: subscriptionError } = await getUserSubscription(user.id);
          if (subscriptionError) {
            console.error('Error loading user subscription:', subscriptionError);
          } else {
            setUserSubscription(subscription);
            
            // Update subscription status
            if (subscription) {
              setIsPaidUser(subscription.tier === 'premium');
              
              // Check if user can send more messages
              const canSend = subscription.tier === 'premium' || 
                (subscription.message_count < 10); // Free tier limit
              setCanSendMoreMessages(canSend);
              
              // Calculate remaining messages for free tier
              if (subscription.tier === 'free') {
                setRemainingMessages(10 - subscription.message_count);
              } else {
                setRemainingMessages(null); // Unlimited for premium
              }
            }
          }
        } catch (err) {
          console.error('Error loading user data:', err);
          setError('Failed to load user data. Please try again later.');
        }
      }
    };
    
    loadUserData();
  }, [user]);

  // Handle sign out
  const handleSignOut = async () => {
    try {
      await signOut();
      // No need to handle redirection as the AuthContext will update and ProtectedRoute will redirect
    } catch (err) {
      console.error('Error signing out:', err);
      setError('Failed to sign out. Please try again.');
    }
  };

  // Get current chat messages
  const getCurrentChatMessages = useCallback(() => {
    const currentChat = chats.find(chat => chat.id === activeChat);
    return currentChat ? currentChat.messages : [];
  }, [chats, activeChat]);

  // Get current chat name
  const getCurrentChatName = useCallback(() => {
    const currentChat = chats.find(chat => chat.id === activeChat);
    return currentChat ? currentChat.name : 'New Chat';
  }, [chats, activeChat]);

  // Handle chat selection
  const handleChatSelect = useCallback((chatId: string) => {
    setActiveChat(chatId);
  }, []);

  // Handle new chat creation
  const handleNewChat = useCallback(() => {
    const newChat: Chat = {
      id: Date.now().toString(),
      name: NEW_CHAT_NAME,
      messages: []
    };
    setChats([...chats, newChat]);
    setActiveChat(newChat.id);
  }, [chats, setChats]);

  // Handle chat deletion
  const handleDeleteChat = useCallback((chatId: string) => {
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    
    if (activeChat === chatId && updatedChats.length > 0) {
      setActiveChat(updatedChats[0].id);
    } else if (updatedChats.length === 0) {
      handleNewChat();
    }
  }, [chats, activeChat, setChats, handleNewChat]);

  // Handle chat renaming
  const handleRenameChat = useCallback((chatId: string, newName: string) => {
    const updatedChats = chats.map(chat => 
      chat.id === chatId ? { ...chat, name: newName } : chat
    );
    setChats(updatedChats);
  }, [chats, setChats]);

  // Handle sending messages
  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    
    // Check if user can send more messages
    if (!canSendMoreMessages) {
      setError('You have reached your message limit. Please upgrade to continue.');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Create a new message
      const newMessage: Message = {
        id: Date.now().toString(),
        content,
        role: 'user',
        timestamp: new Date().toISOString(),
        username: userProfile?.username || user?.email?.split('@')[0] || 'User',
      };
      
      // Update the chat with the new message
      const updatedChats = chats.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
          };
        }
        return chat;
      });
      
      setChats(updatedChats);
      
      // Get AI response
      const currentChat = updatedChats.find(chat => chat.id === activeChat);
      if (!currentChat) throw new Error('Chat not found');
      
      // Format chat history for the AI
      const formattedHistory = currentChat.messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));
      
      // Get response from OpenAI
      const aiResponse = await getOpenAIResponse(formattedHistory);
      
      // Create a new AI message
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date().toISOString(),
        username: 'AI Assistant',
      };
      
      // Update the chat with the AI response
      const finalChats = updatedChats.map(chat => {
        if (chat.id === activeChat) {
          return {
            ...chat,
            messages: [...chat.messages, aiMessage],
          };
        }
        return chat;
      });
      
      setChats(finalChats);
      
      // Track message usage if user is authenticated
      if (user && userSubscription) {
        // Update message count in subscription
        // This would be handled by a Supabase function in production
        console.log('Tracking message usage for user:', user.id);
      }
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = useCallback((suggestion: string) => {
    handleSendMessage(suggestion);
    setSuggestions([]);
  }, [handleSendMessage]);

  // Handle export chat
  const handleExportChat = useCallback(async (format: 'text' | 'pdf' = 'pdf') => {
    setIsExporting(true);
    try {
      const currentChat = chats.find(chat => chat.id === activeChat);
      if (!currentChat) {
        throw new Error('Chat not found');
      }
      
      if (format === 'text') {
        // Export as text
        const chatText = currentChat.messages
          .map(msg => `${msg.role === 'user' ? 'You' : 'AI'}: ${msg.content}`)
          .join('\n\n');
        
        const blob = new Blob([chatText], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentChat.name.replace(/\s+/g, '_')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setToastMessage('Chat exported successfully as text file');
      } else {
        // Export as PDF
        try {
          // Prepare data for PDF
          const title = currentChat.name;
          const headers = ['Role', 'Message', 'Time'];
          const data = currentChat.messages.map(msg => [
            msg.role === 'user' ? 'You' : 'AI',
            msg.content.replace(/\n/g, ' '),
            new Date(msg.timestamp).toLocaleString()
          ]);
          
          // Export to PDF using the utility function
          await exportToPDF({
            filename: `${currentChat.name.replace(/\s+/g, '_')}.pdf`,
            title,
            headers,
            data,
            options: {
              fontSize: userPreferences.fontSize === 'large' ? 12 : 
                      userPreferences.fontSize === 'small' ? 8 : 10,
              theme: isDarkMode ? 'grid' : 'striped',
              addPageNumbers: true
            }
          });
          
          setToastMessage('Chat exported successfully as PDF');
        } catch (error) {
          console.error('Error exporting to PDF:', error);
          
          // Fallback to basic PDF export
          const doc = new jsPDF();
          doc.text(currentChat.name, 20, 20);
          let y = 40;
          
          currentChat.messages.forEach(msg => {
            const prefix = msg.role === 'user' ? 'You: ' : 'AI: ';
            const text = prefix + msg.content.substring(0, 100) + (msg.content.length > 100 ? '...' : '');
            
            // Check if we need a new page
            if (y > 280) {
              doc.addPage();
              y = 20;
            }
            
            doc.text(text, 20, y);
            y += 10;
          });
          
          doc.save(`${currentChat.name.replace(/\s+/g, '_')}.pdf`);
          setToastMessage('Chat exported successfully as PDF (fallback mode)');
        }
      }
    } catch (error) {
      console.error('Error exporting chat:', error);
      setError('Failed to export chat. Please try again.');
    }
    setIsExporting(false);
  }, [activeChat, chats, isDarkMode, userPreferences.fontSize, setToastMessage]);

  // Handle preference updates
  const handleUpdatePreferences = useCallback((newPreferences: Partial<UserPreferences>) => {
    const updatedPreferences = { ...userPreferences, ...newPreferences };
    setUserPreferences(updatedPreferences);
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(updatedPreferences));
  }, [userPreferences]);

  // Handle profile updates
  const handleUpdateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!userProfile || !user) return;
    
    try {
      const updatedProfile = { ...userProfile, ...updates };
      setUserProfile(updatedProfile);
      
      // Update profile using authService
      const { error } = await updateUserProfile(user.id, updates);
      if (error) {
        throw new Error(error.message);
      }
      
      setToastMessage('Profile updated successfully');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  }, [userProfile, user]);

  // Show loading state
  if (!userProfile && user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500" />
          <p className="text-gray-600 dark:text-gray-300">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onRenameChat={handleRenameChat}
        onSignOut={handleSignOut}
        onExportChat={handleExportChat}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        theme={theme}
        userPreferences={userPreferences}
        isCollapsed={!isSidebarOpen}
        onToggleCollapse={() => setIsSidebarOpen(!isSidebarOpen)}
        isMobile={isMobile}
        isDarkMode={isDarkMode}
      />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="mr-4 p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none"
              >
                <Menu size={20} />
              </button>
            )}
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white truncate">
              {getCurrentChatName()}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {isUsingMockService && (
              <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-500 text-yellow-800 dark:text-yellow-300 text-sm rounded-md flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span><strong>Demo Mode</strong></span>
              </div>
            )}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-label="User profile"
            >
              <UserIcon size={20} />
            </button>
          </div>
        </header>
        
        {/* Chat window */}
        <div className="flex-1 overflow-hidden">
          <ChatWindow
            messages={getCurrentChatMessages()}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            preferences={userPreferences}
          />
        </div>
        
        {/* Message input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
      
      {/* Settings modal */}
      {isSettingsOpen && (
        <UserSettings
          preferences={userPreferences}
          onUpdate={handleUpdatePreferences}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
      
      {/* User profile modal */}
      {isProfileOpen && userProfile && (
        <UserProfileComponent
          user={{
            username: userProfile.username || user?.email?.split('@')[0] || 'User',
            email: user?.email,
            joinDate: userProfile.created_at ? new Date(userProfile.created_at) : undefined,
            expirationTime: userSubscription?.expires_at ? new Date(userSubscription.expires_at).getTime() : Date.now() + 30 * 24 * 60 * 60 * 1000,
            preferences: userProfile.preferences,
            subscription: userSubscription ? {
              tier: userSubscription.tier,
              expiresAt: userSubscription.expires_at ? new Date(userSubscription.expires_at).getTime() : undefined,
              messageCount: userSubscription.message_count,
              lastResetTime: new Date(userSubscription.last_reset_time).getTime()
            } : undefined
          }}
          onClose={() => setIsProfileOpen(false)}
          onUpdateProfile={handleUpdateProfile}
        />
      )}
      
      {/* Toast for notifications */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
          type="info"
        />
      )}
      
      {/* Error toast */}
      {error && (
        <Toast
          message={error}
          onClose={() => setError(null)}
          type="error"
        />
      )}
    </div>
  );
};

export default ChatInterface;
