/**
 * Mock Server
 * 
 * This file provides mock implementations for API endpoints during development.
 * It intercepts fetch requests to specific endpoints and returns mock responses.
 */

// Check if we're in development mode
const isDevelopment = import.meta.env.DEV;

// Mock response for chat completion
const mockChatResponse = (messages: any[]) => {
  const lastMessage = messages[messages.length - 1];
  const userMessage = lastMessage.content;
  
  // Generate a simple response based on the user's message
  let response = `I received your message: "${userMessage}". `;
  
  if (userMessage.includes('hello') || userMessage.includes('hi')) {
    response += 'Hello there! How can I help you today?';
  } else if (userMessage.includes('help')) {
    response += 'I\'m here to help. What do you need assistance with?';
  } else if (userMessage.includes('thank')) {
    response += 'You\'re welcome! Is there anything else you\'d like to know?';
  } else if (userMessage.includes('?')) {
    response += 'That\'s a good question. Let me think about it... I would say it depends on the specific context and requirements.';
  } else {
    response += 'I\'m an AI assistant here to help you. Feel free to ask me anything!';
  }
  
  return response;
};

// Initialize the mock server
export const initMockServer = () => {
  if (!isDevelopment) return;
  
  console.log('🔧 Mock server initialized for development');
  
  // Store the original fetch function
  const originalFetch = window.fetch;
  
  // Override the fetch function to intercept API calls
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    // Get the URL string regardless of input type
    const url = typeof input === 'string' 
      ? input 
      : input instanceof URL 
        ? input.toString() 
        : input.url;
    
    // Handle chat API endpoint
    if (url.includes('/api/chat')) {
      console.log('📨 Intercepted request to /api/chat');
      
      try {
        const body = init?.body ? JSON.parse(init.body as string) : {};
        const { messages } = body;
        
        // Generate mock response
        const responseText = mockChatResponse(messages);
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Return mock response
        return new Response(JSON.stringify({ 
          message: responseText,
          status: 'success' 
        }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Error in mock server:', error);
        return new Response(JSON.stringify({ 
          message: 'Error processing request',
          status: 'error' 
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    // Handle usage tracking endpoint
    if (url.includes('/api/usage/track')) {
      console.log('📨 Intercepted request to /api/usage/track');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Return mock response
      return new Response(JSON.stringify({ 
        status: 'success',
        message: 'Usage tracked successfully' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // For all other requests, use the original fetch
    return originalFetch(input, init);
  };
};

// Export a function to reset the fetch override (useful for testing)
export const resetMockServer = () => {
  if (!isDevelopment) return;
  
  // Restore the original fetch if it exists
  if (window.fetch !== originalFetch && originalFetch) {
    window.fetch = originalFetch;
    console.log('🔧 Mock server reset');
  }
};

// Store the original fetch function
const originalFetch = window.fetch; 