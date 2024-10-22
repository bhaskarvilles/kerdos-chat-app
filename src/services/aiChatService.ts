import { Message } from '../types'

const AI_ENDPOINT = 'https://chat.bhaskarvilles.workers.dev/'

export async function getAIResponse(message: string): Promise<string> {
  try {
    const url = new URL(AI_ENDPOINT)
    url.searchParams.append('message', message)

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to get AI response')
    }

    const data = await response.json()
    
    // Extract the chat-style response from the second task
    const chatResponse = data[1].response.response

    return chatResponse
  } catch (error) {
    console.error('Error getting AI response:', error)
    throw error // Re-throw the error to be caught in the ChatInterface
  }
}