export interface Env {
  OPENAI_API_KEY: string;
  DB: D1Database;
  KV: KVNamespace;
  R2: R2Bucket;
}

export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  userId: string;
}

export interface Chat {
  id: string;
  title: string;
  messages: Message[];
  userId: string;
  createdAt: Date;
  updatedAt: Date;
} 