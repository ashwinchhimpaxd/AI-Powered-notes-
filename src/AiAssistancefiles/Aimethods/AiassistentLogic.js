import { generateAIResponse } from "../AiResponse";

/**
 * Standard interface for sending messages to AI.
 * This file is now loosely coupled to the AI provider.
 */
export const sendMessageToAI = async (message, chatHistory = [], onChunk = null, jsonMode = false) => {
    try {
        // Standardized history format: [{ role: 'user'|'assistant', content: '...' }]
        // We pass this directly to the abstraction layer
        const responseText = await generateAIResponse(message, chatHistory, onChunk, jsonMode);

        return responseText;

    } catch (error) {
        console.error("AI Logic Error:", error);
        throw error;
    }
}
