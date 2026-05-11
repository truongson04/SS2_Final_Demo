import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const voiceModel = new GoogleGenerativeAI(process.env.VOICE_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export { genAI, voiceModel, groq };
