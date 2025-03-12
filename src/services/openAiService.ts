import { Message } from '../types';
import { fetchChatCompletion } from "./apiProxy";
import { getAIResponse } from "./aiChatService";

// Format chat history for OpenAI API
export const formatChatHistoryForOpenAI = (messages: Message[]) => {
  console.log('Formatting messages:', messages);
  const formatted = messages.map(msg => ({
    role: msg.role === 'user' ? 'user' : 'assistant',
    content: msg.content
  }));
  console.log('Formatted messages:', formatted);
  return formatted;
};

// Get response from OpenAI API via backend service
export const getOpenAIResponse = async (messages: Array<{ role: string; content: string; }>) => {
  try {
    // Prepare messages for the API
    const formattedMessages = [
      { role: 'system', content: 'You are a helpful, friendly AI assistant.' },
      ...messages
    ];
    
    console.log('Sending request to OpenAI with messages:', formattedMessages);
    
    // Use the backend service via apiProxy
    return await fetchChatCompletion({
      model: 'gpt-3.5-turbo', // Using the standard model name
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000
    });
  } catch (error: any) {
    console.error('Backend service error:', error);
    
    // Last resort: use mock AI service
    try {
      console.log('Using mock AI service as fallback');
      // Find the last user message using reverse find
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user')?.content || '';
      return await getAIResponse(lastUserMessage);
    } catch (mockError) {
      console.error('Mock AI service failed:', mockError);
      throw new Error('Failed to get AI response. Please try again later.');
    }
  }
};