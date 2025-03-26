export interface User {
  id: string;
  name: string;
  avatar?: string;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
} 