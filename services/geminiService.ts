import { GoogleGenAI, Type } from "@google/genai";
import { DayPlan } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// Helper to check if API key is present
export const hasApiKey = () => !!apiKey;

export const generateDestinationDetails = async (destinationName: string): Promise<{ description: string; itinerary: DayPlan[]; priceEstimate: number }> => {
  if (!hasApiKey()) {
    throw new Error("API Key is missing");
  }

  const model = "gemini-2.5-flash";
  const prompt = `Create a travel package for a trip to ${destinationName}. 
  Provide a catchy marketing description (max 50 words), a suggested price in USD for a standard 5-day trip, and a 3-day sample itinerary.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            priceEstimate: { type: Type.NUMBER },
            itinerary: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  activities: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate destination details.");
  }
};

export const suggestDestinations = async (userQuery: string): Promise<string[]> => {
    if (!hasApiKey()) {
        return [];
    }

    const model = "gemini-2.5-flash";
    const prompt = `Suggest 3 top travel destinations based on this user preference: "${userQuery}". Return only a JSON array of strings containing the names of the places.`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                }
            }
        });
        const text = response.text;
        return text ? JSON.parse(text) : [];
    } catch (error) {
        console.error("Gemini Suggestion Error", error);
        return [];
    }
}

export const getTravelAdvice = async (question: string): Promise<string> => {
    if (!hasApiKey()) return "AI Chat is unavailable without an API Key.";
    
    const model = "gemini-2.5-flash";
    try {
        const response = await ai.models.generateContent({
            model,
            contents: `You are a helpful travel agent for "Uncharted Escape". Answer this user question briefly (max 100 words): ${question}`,
        });
        return response.text || "I couldn't generate an answer at this time.";
    } catch (e) {
        return "Sorry, I am having trouble connecting to the travel database.";
    }
}
