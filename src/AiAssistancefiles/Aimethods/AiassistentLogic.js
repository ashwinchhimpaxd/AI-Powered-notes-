import { generateAIResponse } from "../AiResponse";

/**
 * Standard interface for sending messages to AI.
 * This file is now loosely coupled to the AI provider.
 */
export const sendMessageToAI = async (usermessage, chatHistory = [], onChunk = null, jsonMode = false, systemPrompt = null) => {

    try {
        if (!usermessage) {
            throw new Error("Message is required");
        }
        // Standardized history format: [{ role: 'user'|'assistant', content: '...' }]
        // We pass this directly to the abstraction layer
        const responseText = await generateAIResponse(usermessage, chatHistory, onChunk, jsonMode, null, systemPrompt);

        return responseText;

    } catch (error) {
        console.error("AI Error:", error);
        throw error;
    }
}
