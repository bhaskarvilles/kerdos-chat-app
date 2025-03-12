/**
 * API Proxy Service
 * 
 * This service provides a more secure way to interact with the OpenAI API
 * by proxying requests through a server-side endpoint.
 * 
 * For a production application, you would implement this proxy on your backend server
 * to keep your API keys secure.
 */

interface ChatCompletionRequest {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  temperature?: number;
  max_tokens?: number;
}

// Get the API proxy URL from environment variables or use a default
const API_PROXY_URL = import.meta.env.VITE_API_PROXY_URL || '/api';

/**
 * Track message usage for subscription limits
 * In a production app, this would be handled by your backend
 */
export const trackMessageUsage = async (username: string): Promise<void> => {
  try {
    const response = await fetch(`${API_PROXY_URL}/usage/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to track message usage');
    }
  } catch (error) {
    console.error('Error tracking message usage:', error);
    // Continue even if tracking fails - don't block the user
  }
};

/**
 * Fetch chat completion from the proxy service
 * In a production environment, this would call your backend API
 * which would then forward the request to OpenAI
 */
export const fetchChatCompletion = async (request: ChatCompletionRequest): Promise<string> => {
  try {
    const response = await fetch(`${API_PROXY_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to get chat completion');
    }
    
    const data = await response.json();
    return data.message || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error fetching chat completion:', error);
    throw error;
  }
}; 