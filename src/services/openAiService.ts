import { Message } from '../types';
import { fetchChatCompletion } from "./apiProxy";
import { getAIResponse } from "./aiChatService";

// Format chat history for OpenAI API
export const formatChatHistoryForOpenAI = (messages: Message[]) => {
  return messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
};

// Get response from OpenAI API via backend service
export const getOpenAIResponse = async (prompt: string, history: any[] = []) => {
  try {
    // Prepare messages for the API
    const messages = [
      { role: 'system', content: 'You are a helpful, friendly AI assistant.' },
      ...history,
      { role: 'user', content: prompt }
    ];
    
    // Use the backend service via apiProxy
    console.log('Using backend service for AI response');
    return await fetchChatCompletion({
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000
    });
  } catch (error: any) {
    console.error('Backend service error:', error);
    
    // Last resort: use mock AI service
    try {
      console.log('Using mock AI service as fallback');
      return await getAIResponse(prompt);
    } catch (mockError) {
      console.error('Mock AI service failed:', mockError);
      throw new Error('Failed to get AI response. Please try again later.');
    }
  }
};