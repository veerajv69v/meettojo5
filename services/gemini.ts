import { GoogleGenAI } from "@google/genai";

// Initialize Gemini
// In production, ensure process.env.API_KEY is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateBio = async (interests: string[], job: string): Promise<string> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key provided for Gemini.");
    return `I'm a ${job} who loves ${interests.join(', ')}.`;
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Write a short, witty, and attractive dating app bio (max 150 chars) for a person who works as a "${job}" and is interested in: ${interests.join(', ')}. Do not use hashtags.`;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    
    return response.text?.trim() || `I'm a ${job} who loves ${interests.join(', ')}.`;
  } catch (e) {
    console.error("Gemini AI Error:", e);
    // Fallback if API fails
    return `Just a ${job} exploring the world. Likes: ${interests.join(', ')}.`;
  }
};

export const generateIcebreaker = async (matchInterests: string[]): Promise<string> => {
   if (!process.env.API_KEY) return "Hey! How's it going?";

  try {
     const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Give me a funny, non-cringy icebreaker line for someone who likes ${matchInterests.join(', ')}.`,
    });
    return response.text?.trim() || "Hey! How's it going?";
  } catch (e) {
    return "Hey! How's it going?";
  }
};