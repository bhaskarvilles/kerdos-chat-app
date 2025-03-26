'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Message, User } from '@/app/types/chat';
import { Send, Check, CheckCheck, Loader2 } from 'lucide-react';

interface ChatProps {
  currentUser: User;
  initialMessages?: Message[];
  isAIChat?: boolean;
}

export function Chat({ currentUser, initialMessages = [], isAIChat = false }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const simulateAIResponse = async (message: string) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate AI thinking
    const aiMessage: Message = {
      id: Date.now().toString(),
      content: `I received your message: "${message}". This is a simulated AI response.`,
      userId: 'ai',
      timestamp: new Date(),
      status: 'read',
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage.trim(),
      userId: currentUser.id,
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 1000);

    // Simulate message read
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
        )
      );
    }, 2000);

    if (isAIChat) {
      await simulateAIResponse(inputMessage.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStatusIcon = (status: Message['status']) => {
    switch (status) {
      case 'sent':
        return <Check className="h-3 w-3" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <Card className="flex flex-col h-screen w-full rounded-none">
      {/* Chat Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={isAIChat ? "https://github.com/shadcn.png" : currentUser.avatar} />
            <AvatarFallback>
              {isAIChat ? 'AI' : currentUser.name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{isAIChat ? 'AI Assistant' : currentUser.name}</h2>
            <p className="text-sm text-muted-foreground">
              {isAIChat ? 'Always here to help' : 'Online'}
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-2 ${
                message.userId === currentUser.id ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={message.userId === 'ai' 
                    ? "https://github.com/shadcn.png" 
                    : message.userId === currentUser.id 
                      ? currentUser.avatar 
                      : undefined
                  } 
                />
                <AvatarFallback>
                  {message.userId === 'ai' 
                    ? 'AI' 
                    : message.userId === currentUser.id 
                      ? currentUser.name[0] 
                      : 'U'
                  }
                </AvatarFallback>
              </Avatar>
              <div
                className={`rounded-lg px-4 py-2 max-w-[70%] ${
                  message.userId === currentUser.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                  {message.userId === currentUser.id && (
                    <span className="text-xs">
                      {getMessageStatusIcon(message.status)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="bg-muted rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">AI is typing...</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
} 