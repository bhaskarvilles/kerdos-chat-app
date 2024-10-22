import { User } from '../types';

// This is a mock implementation. In a real-world scenario, this would involve
// checking against a database or an API endpoint.
export const checkUserPaidStatus = async (username: string): Promise<boolean> => {
  // Simulating an API call with a timeout
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // For demonstration purposes, let's consider users with even-length usernames as paid
  return username.length % 2 === 0;
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