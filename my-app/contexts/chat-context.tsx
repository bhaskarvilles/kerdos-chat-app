'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/auth-context';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  userId: string;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  messages: Message[];
  loading: boolean;
  createNewChat: () => Promise<void>;
  sendMessage: (content: string, role?: 'user' | 'assistant') => Promise<void>;
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://your-worker.workers.dev';

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setChats([]);
      setCurrentChat(null);
      setMessages([]);
      setLoading(false);
      return;
    }

    // Fetch user's chats
    const fetchChats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/chats`, {
          headers: {
            'X-User-ID': user.id,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch chats: ${response.statusText}`);
        }

        const chatsData = await response.json();
        setChats(chatsData);
      } catch (error) {
        console.error('Error fetching chats:', error);
        // Add retry logic
        setTimeout(fetchChats, 5000); // Retry after 5 seconds
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  useEffect(() => {
    if (!currentChat) {
      setMessages([]);
      return;
    }

    // Fetch messages for current chat
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/chats/${currentChat.id}/messages`, {
          headers: {
            'X-User-ID': user?.id || '',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const messagesData = await response.json();
        setMessages(messagesData);

        // Update the chat in the chats array with the latest messages
        setChats(prevChats => 
          prevChats.map(chat => 
            chat.id === currentChat.id 
              ? { ...chat, messages: messagesData }
              : chat
          )
        );
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [currentChat, user?.id]);

  const createNewChat = async () => {
    if (!user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/chats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.id,
        },
        body: JSON.stringify({
          title: 'New Chat',
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create chat: ${response.statusText}`);
      }

      const newChat = await response.json();
      setCurrentChat(newChat);
      setChats(prevChats => [newChat, ...prevChats]);
    } catch (error) {
      console.error('Error creating new chat:', error);
      // Add retry logic
      setTimeout(createNewChat, 5000); // Retry after 5 seconds
    }
  };

  const sendMessage = async (content: string, role: 'user' | 'assistant' = 'user') => {
    if (!user || !currentChat) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/chats/${currentChat.id}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': user.id,
        },
        body: JSON.stringify({
          content,
          role,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const message = await response.json();
      setMessages(prev => [...prev, message]);

      // Update chat title if it's the first message
      if (messages.length === 0) {
        const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
        await fetch(`${API_BASE_URL}/api/chats/${currentChat.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-User-ID': user.id,
          },
          body: JSON.stringify({ title }),
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const selectChat = (chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
    }
  };

  const deleteChat = async (chatId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/chats/${chatId}`, {
        method: 'DELETE',
        headers: {
          'X-User-ID': user.id,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete chat');
      }

      if (currentChat?.id === chatId) {
        setCurrentChat(null);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChat,
        messages,
        loading,
        createNewChat,
        sendMessage,
        selectChat,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
} 