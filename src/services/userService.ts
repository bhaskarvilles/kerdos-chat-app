import { User } from '../types';
import { checkSubscriptionExpiry, updateMessageCount } from './subscriptionService';

// This is a mock implementation. In a real-world scenario, this would involve
// checking against a database or an API endpoint.
export const checkUserPaidStatus = async (username: string): Promise<boolean> => {
  // Simulate API call to check user's paid status
  const mockPaidUsers = ['premium_user1', 'premium_user2', username];
  return mockPaidUsers.includes(username);
};

export const saveOpenAIKey = (key: string) => {
  localStorage.setItem('openai_key', key);
  localStorage.setItem('openai_key_expiry', (Date.now() + 3600000).toString()); // 1 hour from now
};

export const getOpenAIKey = (): string | null => {
  const key = localStorage.getItem('openai_key');
  const expiry = localStorage.getItem('openai_key_expiry');
  
  if (key && expiry && parseInt(expiry) > Date.now()) {
    return key;
  }
  
  // Clear expired key
  localStorage.removeItem('openai_key');
  localStorage.removeItem('openai_key_expiry');
  return null;
};

// Update user in local storage
export const updateUser = (user: User): User => {
  // Check if subscription has expired
  user = checkSubscriptionExpiry(user);
  
  // Save to local storage
  localStorage.setItem('chatUser', JSON.stringify(user));
  return user;
};

// Update message count for user
export const incrementMessageCount = (user: User): User => {
  user = updateMessageCount(user);
  return updateUser(user);
};

// Initialize subscription for a new user
export const initializeUserSubscription = (user: User): User => {
  if (!user.subscription) {
    user.subscription = {
      tier: 'free',
      messageCount: 0,
      lastResetTime: Date.now()
    };
  }
  
  return updateUser(user);
};