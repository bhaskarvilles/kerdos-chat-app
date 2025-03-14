import { Message } from '../types';

export interface AIService {
  summarizeConversation: (messages: Message[]) => Promise<string>;
  suggestResponses: (context: Message[]) => Promise<string[]>;
}

export interface AIFeatures {
  summarizeConversation: (messages: Message[]) => Promise<string>;
  generateTags: (content: string) => Promise<string[]>;
  detectLanguage: (text: string) => Promise<string>;
  translateMessage: (text: string, targetLang: string) => Promise<string>;
  suggestResponses: (context: Message[]) => Promise<string[]>;
} 