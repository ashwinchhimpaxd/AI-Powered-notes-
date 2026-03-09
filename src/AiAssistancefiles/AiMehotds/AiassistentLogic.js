import { model } from "../geminiset";


export const sendMessageToAI = async (message, chatHistory = [], onChunk = null) => {
    try {
        const formattedHistory = chatHistory.map((msg) => ({
            role: msg.type === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }));

        const chat = model.startChat({
            history: formattedHistory,
        });

        console.log("Sending message to AI:", message);

        if (onChunk) {
            const result = await chat.sendMessageStream(message);
            let fullText = "";
            for await (const chunk of result.stream) {
                const chunkText = chunk.text();
                fullText += chunkText;
                onChunk(fullText);
            }
            return fullText;
        } else {
            const result = await chat.sendMessage(message);
            const responseText = result.response.text();
            console.log("AI Response:", responseText);
            return responseText;
        }
    } catch (error) {
        console.log("AI Error:", error);
        return "Sorry, I'm having trouble understanding you right now.";
    }
}
