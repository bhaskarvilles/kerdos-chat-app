import OpenAI from "openai";
import { Message } from '../types';
import { fetchChatCompletion } from "./apiProxy";
import { getAIResponse } from "./aiChatService";

let openai: OpenAI | null = null;

// Initialize OpenAI with environment variables or user-provided key
export const initializeOpenAI = (apiKey?: string) => {
  try {
    // Use environment variables if available, otherwise use provided key or stored key
    const key = apiKey || 
                import.meta.env.VITE_OPENAI_API_KEY || 
                localStorage.getItem('openai_api_key');
                
    const organizationId = import.meta.env.VITE_OPENAI_ORG_ID;
    
    if (!key) {
      console.warn('OpenAI API key not found. Some features may not work.');
      return;
    }
    
    const config: any = { 
      apiKey: key,
      dangerouslyAllowBrowser: true // Required for browser usage
    };
    
    // Add organization ID if available
    if (organizationId) {
      config.organization = organizationId;
    }
    
    openai = new OpenAI(config);
    console.log('OpenAI client initialized successfully');
  } catch (error) {
    console.error('Error initializing OpenAI client:', error);
  }
};

// Save API key to local storage
export const saveOpenAIKey = (key: string) => {
  localStorage.setItem('openai_api_key', key);
};

// Get API key from local storage
export const getOpenAIKey = () => {
  return localStorage.getItem('openai_api_key');
};

// Format chat history for OpenAI API
export const formatChatHistoryForOpenAI = (messages: Message[]) => {
  return messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
};

// Get response from OpenAI API
export const getOpenAIResponse = async (prompt: string, history: any[] = []) => {
  try {
    // Try to use direct OpenAI API first
    if (!openai) {
      // Try to initialize with stored key if not already initialized
      initializeOpenAI();
    }
    
    if (openai) {
      try {
        // Prepare messages for the API
        const messages = [
          { role: 'system', content: 'You are a helpful, friendly AI assistant.' },
          ...history,
          { role: 'user', content: prompt }
        ];
        
        // Call the API
        const response = await openai.chat.completions.create({
          model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
        });
        
        // Return the response text
        return response.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
      } catch (directError) {
        console.error('Error using direct OpenAI API:', directError);
        // Fall through to proxy service
      }
    }
    
    // Fallback to proxy service
    console.log('Falling back to proxy service');
    return await fetchChatCompletion({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful, friendly AI assistant.' },
        ...history,
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
  } catch (error: any) {
    console.error('All API methods failed:', error);
    
    // Last resort: use mock AI service
    try {
      console.log('Using mock AI service as last resort');
      return await getAIResponse(prompt);
    } catch (mockError) {
      console.error('Mock AI service failed:', mockError);
      throw new Error('Failed to get AI response. Please check your API key or try again later.');
    }
  }
};