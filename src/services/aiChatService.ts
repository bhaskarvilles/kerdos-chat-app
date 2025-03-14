/**
 * Mock AI Chat Service
 * 
 * This service provides mock AI responses for testing and development purposes.
 * It's used as a fallback when the OpenAI API is not available or encounters errors.
 */

// Sample responses for different types of queries
const SAMPLE_RESPONSES: Record<string, string[]> = {
  greeting: [
    "Hello! How can I assist you today?",
    "Hi there! What can I help you with?",
    "Greetings! How may I be of service?",
    "Good day! How can I support you today?"
  ],
  question: [
    "That's an interesting question. Based on my knowledge, I would say that...",
    "Great question! From what I understand, the answer is...",
    "I'd be happy to help with that question. Here's what I know:",
    "Let me think about that for a moment. I believe the answer is..."
  ],
  technical: [
    "From a technical perspective, this involves several components. First, you need to understand that...",
    "This is a complex technical topic. The key aspects to consider are...",
    "When dealing with this technical challenge, it's important to remember that...",
    "The technical approach I would recommend involves the following steps:"
  ],
  general: [
    "I understand what you're asking. Here's my perspective on that...",
    "That's something I can help with. Let me share some thoughts...",
    "I appreciate you bringing this up. Here's what I think...",
    "Thank you for sharing that. Here's my response:"
  ]
};

/**
 * Categorize the user's message to determine the appropriate response type
 */
const categorizeMessage = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey') || lowerMessage.includes('greetings')) {
    return 'greeting';
  }
  
  if (lowerMessage.includes('?') || lowerMessage.startsWith('what') || lowerMessage.startsWith('how') || lowerMessage.startsWith('why') || lowerMessage.startsWith('when') || lowerMessage.startsWith('where')) {
    return 'question';
  }
  
  if (lowerMessage.includes('code') || lowerMessage.includes('programming') || lowerMessage.includes('javascript') || lowerMessage.includes('python') || lowerMessage.includes('api') || lowerMessage.includes('database')) {
    return 'technical';
  }
  
  return 'general';
};

/**
 * Get a random response from the appropriate category
 */
const getRandomResponse = (category: string, message: string): string => {
  const responses = SAMPLE_RESPONSES[category] || SAMPLE_RESPONSES.general;
  const randomIndex = Math.floor(Math.random() * responses.length);
  
  // Add a custom part based on the user's message to make it feel more personalized
  const userWords = message.split(' ').filter(word => word.length > 4);
  let customPart = '';
  
  if (userWords.length > 0) {
    const randomWord = userWords[Math.floor(Math.random() * userWords.length)];
    customPart = ` I noticed you mentioned "${randomWord}". `;
  }
  
  return responses[randomIndex] + customPart + "As this is a mock AI service (the real OpenAI service couldn't be reached), I'm providing a simulated response. In a production environment, you would receive a more tailored answer from the actual AI model.";
};

/**
 * Simulate a delay to mimic API response time
 */
const simulateDelay = async (): Promise<void> => {
  const delay = Math.floor(Math.random() * 1000) + 500; // 500-1500ms
  return new Promise(resolve => setTimeout(resolve, delay));
};

/**
 * Get a mock AI response for the given message
 */
export const getAIResponse = async (message: string): Promise<string> => {
  // Simulate network delay
  await simulateDelay();
  
  // Categorize the message and get an appropriate response
  const category = categorizeMessage(message);
  return getRandomResponse(category, message);
};