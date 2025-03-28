'use client';

import { useAuth } from '@/contexts/auth-context';
import { ChatInterface } from '@/components/chat/chat-interface';
import MainLayout from '@/components/layout/main-layout';

export default function Home() {
  const { user } = useAuth();

  if (!user) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
          <h1 className="text-4xl font-bold mb-4">Welcome to AI Chat</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Please sign in to start chatting with our AI assistant.
          </p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <ChatInterface />
    </MainLayout>
  );
}
