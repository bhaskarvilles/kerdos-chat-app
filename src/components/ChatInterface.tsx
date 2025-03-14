import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { ChatWindow } from './ChatWindow'
import MessageInput from './MessageInput'
import UserSettings from './UserSettings'
import { Message, Chat, UserPreferences, UserProfile, UserSubscription } from '../types'
import { User as UserIcon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useAuth } from '../contexts/AuthContext'
import { getOpenAIResponse, formatChatHistoryForOpenAI } from '../services/openAiService'
import { getUserProfile, getUserSubscription, updateUserProfile } from '../services/authService'
import { trackMessageUsage } from '../services/apiProxy'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { CHAT_STORAGE_KEY, USER_PREFERENCES_KEY, DEFAULT_USER_PREFERENCES, NEW_CHAT_NAME } from '../constants'
import { showToast } from '@/components/Toast'
import Sidebar from './Sidebar'
import { jsPDF } from 'jspdf'
import 'jspdf-autotable'
import { exportToPDF } from '../utils/pdfUtils'
import UserProfilePage from './UserProfilePage'
import { cn } from "@/lib/utils"
import { debounce } from 'lodash'
import { Dialog, DialogContent } from '@/components/ui/dialog'

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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
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
  const [canSendMoreMessages, setCanSendMoreMessages] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme()
  const isDarkMode = theme === 'dark'
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Memoize theme-dependent values
  const themeClasses = useMemo(() => ({
    container: "flex h-[calc(100vh-3rem)] overflow-hidden relative",
    background: isDarkMode ? "bg-gray-900" : "bg-gray-50",
    header: "flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-10 relative",
    headerTitle: "text-lg sm:text-xl font-semibold text-gray-800 dark:text-white truncate max-w-[200px] sm:max-w-none",
    mainContent: "flex flex-col flex-1 overflow-hidden relative z-10",
    chatWindow: "flex-1 overflow-hidden relative",
    messageInput: "p-2 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
  }), [isDarkMode])

  // Debounced window resize handler
  useEffect(() => {
    const handleResize = debounce(() => {
      const width = window.innerWidth
      if (width >= 768) {
        setIsSidebarOpen(true)
      }
    }, 150)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Load user profile and subscription data
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      
      try {
        // Load user profile
        const profileResult = await getUserProfile(user.id);
        if (profileResult.error) {
          console.error('Error loading user profile:', profileResult.error);
        } else if (profileResult.profile) {
          setUserProfile(profileResult.profile);
        }
        
        // Load user subscription
        const subscriptionResult = await getUserSubscription(user.id);
        if (subscriptionResult.error) {
          console.error('Error loading user subscription:', subscriptionResult.error);
        } else if (subscriptionResult.subscription) {
          setUserSubscription(subscriptionResult.subscription);
          
          // Update subscription status
          if (subscriptionResult.subscription) {
            setCanSendMoreMessages(subscriptionResult.subscription.tier === 'premium' || 
              (subscriptionResult.subscription.message_count < 10)); // Free tier limit
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        setError('Failed to load user data. Please try again later.');
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
      const formattedHistory = formatChatHistoryForOpenAI(currentChat.messages);
      
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
      
      // Track message usage
      if (user?.email) {
        await trackMessageUsage(user.email);
      }
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle export chat
  const handleExportChat = useCallback(async (format: 'text' | 'pdf' = 'pdf') => {
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
        
        showToast('Chat exported successfully as text file', 'success');
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
          
          // Update the exportToPDF call with correct arguments
          await exportToPDF(
            `${currentChat.name.replace(/\s+/g, '_')}.pdf`,
            title,
            headers,
            data,
            {
              fontSize: userPreferences.fontSize === 'large' ? 12 : 
                      userPreferences.fontSize === 'small' ? 8 : 10,
              theme: isDarkMode ? 'grid' : 'striped',
              addPageNumbers: true
            }
          );
          
          showToast('Chat exported successfully as PDF', 'success');
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
          showToast('Chat exported successfully as PDF (fallback mode)', 'success');
        }
      }
    } catch (error) {
      console.error('Error exporting chat:', error);
      setError('Failed to export chat. Please try again.');
    }
  }, [activeChat, chats, isDarkMode, userPreferences.fontSize]);

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
      
      showToast('Profile updated successfully', 'success');
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    }
  }, [userProfile, user]);

  // Update error handling to use toast
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      setError(null);
    }
  }, [error]);

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
    <div className={cn(themeClasses.container, themeClasses.background)}>
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onSignOut={handleSignOut}
        onExportChat={handleExportChat}
        onToggleTheme={toggleTheme}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isCollapsed={!isSidebarOpen}
      />
      
      {/* Main content */}
      <div className={themeClasses.mainContent}>
        {/* Header */}
        <header className={themeClasses.header}>
          <div className="flex items-center space-x-2">
            <h1 className={themeClasses.headerTitle}>
              {getCurrentChatName()}
            </h1>
          </div>
          
          <div className="flex items-center space-x-2">
            {isUsingMockService && (
              <div className="hidden sm:flex px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-500 text-yellow-800 dark:text-yellow-300 text-xs sm:text-sm rounded-md items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span><strong>Demo Mode</strong></span>
              </div>
            )}
            <button
              onClick={() => setIsProfileOpen(true)}
              className="p-1.5 sm:p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
              aria-label="User profile"
            >
              <UserIcon size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </header>
        
        {/* Chat window */}
        <div className={themeClasses.chatWindow}>
          <ChatWindow
            messages={getCurrentChatMessages()}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
        
        {/* Message input */}
        <div className={themeClasses.messageInput}>
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
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="max-w-4xl p-0">
            <UserProfilePage
              user={{
                username: userProfile.username || user?.email?.split('@')[0] || 'User',
                email: user?.email || '',
                joinDate: userProfile.created_at ? new Date(userProfile.created_at) : undefined,
                expirationTime: userSubscription?.expires_at ? new Date(userSubscription.expires_at).getTime() : Date.now() + 30 * 24 * 60 * 60 * 1000,
                preferences: userProfile.preferences || {
                  notifications: false,
                  language: 'en',
                  timezone: 'UTC'
                },
                subscription: userSubscription ? {
                  tier: userSubscription.tier,
                  expiresAt: userSubscription.expires_at ? new Date(userSubscription.expires_at).getTime() : undefined,
                  messageCount: userSubscription.message_count,
                  lastResetTime: new Date(userSubscription.last_reset_time).getTime()
                } : undefined
              }}
              onUpdateProfile={handleUpdateProfile}
              onSignOut={handleSignOut}
              onOpenSettings={() => {
                setIsProfileOpen(false);
                setIsSettingsOpen(true);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ChatInterface;
