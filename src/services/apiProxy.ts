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

// Backend service URL
const BACKEND_SERVICE_URL = 'https://openai-chat-backend-gbuu.onrender.com';

/**
 * Track message usage for subscription limits
 * In a production app, this would be handled by your backend
 */
export const trackMessageUsage = async (username: string): Promise<void> => {
  try {
    const response = await fetch(`${BACKEND_SERVICE_URL}/api/usage/track`, {
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
 * Fetch chat completion from the backend service
 */
export const fetchChatCompletion = async (request: ChatCompletionRequest): Promise<string> => {
  try {
    console.log('Request details:', {
      url: `${BACKEND_SERVICE_URL}/api/chat`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request, null, 2)
    });
    
    const response = await fetch(`${BACKEND_SERVICE_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      
      const errorData = JSON.parse(errorText || '{}');
      throw new Error(errorData.message || `Failed to get chat completion: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    
    return data.message || data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('Error fetching chat completion:', error);
    throw error;
  }
}; 