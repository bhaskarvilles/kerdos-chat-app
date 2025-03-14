export interface AccessibilitySettings {
  fontSize: "medium" | "large";
  lineSpacing: "normal" | "wide";
  dyslexicFont: boolean;
  colorScheme: "default" | "high-contrast";
  highContrast: boolean;
  reducedMotion: boolean;
}

export interface UserPreferences {
  notifications: boolean;
  language: string;
  timezone: string;
}

export interface UserSubscription {
  type: string;
  status: string;
  expiresAt: number;
  messageCount: number;
  messageLimit: number;
}

export interface Message {
  id: string;
  content: string;
  timestamp: number;
  role: 'user' | 'assistant';
  attachments?: Array<{
    type: string;
    url: string;
    name: string;
  }>;
} 