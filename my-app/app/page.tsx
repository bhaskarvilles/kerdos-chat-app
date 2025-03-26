'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Chat } from '@/components/chat/chat';
import { MainLayout } from '@/components/layout/main-layout';
import { useAuth } from '@/contexts/auth-context';
import { Loader2 } from 'lucide-react';

const initialMessages = [
  {
    id: '1',
    content: 'Hello! I\'m your AI assistant. How can I help you today?',
    userId: 'ai',
    timestamp: new Date(),
    status: 'read' as const,
  },
  {
    id: '2',
    content: 'Hi! I\'d like to learn more about the features of this chat application.',
    userId: '1',
    timestamp: new Date(),
    status: 'read' as const,
  },
  {
    id: '3',
    content: 'I\'d be happy to help! This chat application includes features like:\n\n- Real-time messaging\n- Message status indicators\n- Typing indicators\n- User avatars\n- Message timestamps\n- AI assistant integration\n\nWhat would you like to know more about?',
    userId: 'ai',
    timestamp: new Date(),
    status: 'read' as const,
  },
];

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <MainLayout currentUser={user}>
      <Chat currentUser={user} initialMessages={initialMessages} isAIChat={true} />
    </MainLayout>
  );
}
