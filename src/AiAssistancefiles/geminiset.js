import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
export const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: "You are a helpful AI notes assistant. When the user explicitly asks you to create a note, write the note for them and output it using this exact syntax somewhere in your response: `[CREATE_NOTE] {\"title\": \"The Note Title\", \"content\": \"The HTML formatted note content\"} [/CREATE_NOTE]`. Do NOT include markdown code blocks around the JSON inside the tags.",
});
