import { Message } from '../types';

interface SearchOptions {
  query: string;
  filters?: {
    dateRange?: {
      start: Date;
      end: Date;
    };
    sender?: string;
    messageType?: 'user' | 'assistant';
  };
}

interface SearchResult {
  results: Message[];
  total: number;
  error: Error | null;
}

// Mock messages for testing
const mockMessages: Message[] = [
  {
    id: '1',
    content: 'Hello, how are you?',
    role: 'user',
    timestamp: new Date().toISOString(),
    username: 'user1'
  },
  {
    id: '2',
    content: 'I am doing well, thanks!',
    role: 'assistant',
    timestamp: new Date().toISOString(),
    username: 'user2'
  }
];

export const searchMessages = async (options: SearchOptions): Promise<SearchResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Use the options to filter messages
  const results = mockMessages.filter(message => {
    // Apply query filter
    if (!message.content.toLowerCase().includes(options.query.toLowerCase())) {
      return false;
    }

    // Apply date range filter
    if (options.filters?.dateRange) {
      const messageDate = new Date(message.timestamp);
      if (messageDate < options.filters.dateRange.start || messageDate > options.filters.dateRange.end) {
        return false;
      }
    }

    // Apply sender filter
    if (options.filters?.sender && message.username !== options.filters.sender) {
      return false;
    }

    // Apply message type filter
    if (options.filters?.messageType && message.role !== options.filters.messageType) {
      return false;
    }

    return true;
  });

  return {
    results,
    total: results.length,
    error: null
  };
}; 