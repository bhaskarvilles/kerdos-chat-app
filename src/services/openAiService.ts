import OpenAI from "openai";

let openai: OpenAI | null = null;

export const initializeOpenAI = (apiKey: string) => {
  openai = new OpenAI({ apiKey });
};

export const getOpenAIResponse = async (message: string): Promise<string> => {
  if (!openai) {
    throw new Error("OpenAI has not been initialized. Please provide an API key.");
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: message },
      ],
    });

    return completion.choices[0].message.content || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Error getting OpenAI response:", error);
    throw error; // Re-throw the error to be caught in the ChatInterface
  }
};