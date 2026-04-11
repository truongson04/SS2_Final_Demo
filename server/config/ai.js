import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const voiceModel = new GoogleGenerativeAI(process.env.VOICE_KEY);
export { genAI, voiceModel };
