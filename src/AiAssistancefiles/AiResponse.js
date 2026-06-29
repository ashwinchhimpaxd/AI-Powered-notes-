import axios from "axios";
import AppwriteConf from "@/appwriteConfigrationKeys/ConfigrationofAppwrite";

/**
 * CENTRALIZED AI SERVICE
 * All AI-related features use this layer.
 * If changing provider/model later,
 * only modify this file.
 */

class AIService {

    constructor() {
        this.invokeUrl =
            "/api/nvidia/v1/chat/completions";

        this.headers = {
            Authorization: `Bearer ${AppwriteConf.nvidiaApiKey}`,
            "Content-Type": "application/json"
        };
    }

    /**
     * Standardized AI request
     * @param {string} prompt
     * @param {Function|null} onChunk
     */

    async sendMessage(prompt, onChunk = null, jsonMode = false, signal = null, systemPrompt = null) {

        try {


            const messages = [

                {
                    role: "system",
                    content: systemPrompt ||
                        `You are a helpful AI notes assistant.

                            When the user explicitly asks you to create a note,
                            output it using this exact syntax:

                            [CREATE_NOTE]
                            {
                            "title": "The Note Title",
                            "content": "HTML formatted note content"
                            }
                            [/CREATE_NOTE]

                            Rules:
                            - No markdown code blocks
                            - Keep notes clean and structured
                            - Use proper HTML formatting
                            - Be concise and readable`
                },

                {
                    role: "user",
                    content: prompt
                }
            ];

            const isStreaming = !!onChunk;

            /**
             * NVIDIA API Payload
             */

            const payload = {

                // model: "google/gemma-3n-e2b-it",
                // model: "google/gemma-4-31b-it", //i think is model is fast to first model and more advanced also
                // model: "google/gemma-4-31b-it", //i think is the best model for this project it is fast and advanced
                // model: "meta/llama-3.3-70b-instruct",
                // model: "google/gemma-4-31b-it",
                // model: "google/gemma-3-27b-it",
                // model: "google/gemma-3n-e4b-it",
                // model: "meta/llama-3.1-8b-instruct",google/gemma-3n-e4b-it
                // model: "minimaxai/minimax-m2.7",
                // model: "minimaxai/minimax-m3",
                // model: "nvidia/nemotron-3-nano-30b-a3b",
                model: "deepseek-ai/deepseek-v4-flash",

                messages,

                max_tokens: 4096,

                temperature: 1,

                top_p: 0.95,

                frequency_penalty: 0,

                presence_penalty: 0,

                stream: isStreaming,
                chat_template_kwargs: { "thinking": true, "reasoning_effort": "high" },
            };

            if (jsonMode) {
                payload.response_format = { type: "json_object" };
            }

            /**
             * STREAMING RESPONSE
             */

            if (isStreaming) {
                const response = await fetch(this.invokeUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...this.headers,
                        Accept: "text/event-stream"
                    },
                    body: JSON.stringify(payload),
                    signal
                });

                if (!response.ok) {
                    const errText = await response.text();
                    throw new Error(`AI service error: ${response.status} - ${errText}`);
                }

                const reader = response.body.getReader();
                const decoder = new TextDecoder("utf-8");
                let fullText = "";
                let buffer = "";

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop() || "";

                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        if (!trimmedLine) continue;

                        if (trimmedLine.startsWith("data:")) {
                            const jsonStr = trimmedLine.replace("data:", "").trim();
                            if (jsonStr === "[DONE]") {
                                continue;
                            }

                            try {
                                const parsed = JSON.parse(jsonStr);
                                const content = parsed?.choices?.[0]?.delta?.content || "";
                                if (content) {
                                    fullText += content;
                                    onChunk(fullText, content);
                                }
                            } catch (err) {
                                console.error("Stream parse error:", err);
                            }
                        }
                    }
                }

                if (buffer.trim()) {
                    const trimmedLine = buffer.trim();
                    if (trimmedLine.startsWith("data:")) {
                        const jsonStr = trimmedLine.replace("data:", "").trim();
                        if (jsonStr !== "[DONE]") {
                            try {
                                const parsed = JSON.parse(jsonStr);
                                const content = parsed?.choices?.[0]?.delta?.content || "";
                                if (content) {
                                    fullText += content;
                                    onChunk(fullText, content);
                                }
                            } catch (err) {
                                // Ignore
                            }
                        }
                    }
                }

                return fullText;
            }

            /**
             * NORMAL RESPONSE
             */
            else {

                const response = await axios.post(
                    this.invokeUrl,
                    payload,
                    {
                        headers: {
                            ...this.headers,
                            Accept: "application/json"
                        },
                        signal
                    }
                );

                return (
                    response.data
                        ?.choices?.[0]
                        ?.message?.content || ""
                );
            }

        } catch (error) {

            if (axios.isCancel(error)) {
                const cancelError = new Error("canceled");
                cancelError.name = "CanceledError";
                cancelError.code = "ERR_CANCELED";
                throw cancelError;
            }

            console.error(
                "AI Service Error:",
                error?.response?.data || error.message
            );

            let status = error?.response?.status;
            let originalMsg = error.message || "";

            if (!status && originalMsg.startsWith("AI service error:")) {
                const match = originalMsg.match(/AI service error:\s*(\d+)/);
                if (match) {
                    status = parseInt(match[1], 10);
                }
            }

            let cleanMsg = "Failed to communicate with AI.";
            if (status) {
                if (status === 400) {
                    cleanMsg = "Invalid request to AI service.";
                } else if (status === 401) {
                    cleanMsg = "Authentication failed. Please verify your AI API key.";
                } else if (status === 429) {
                    cleanMsg = "AI rate limit reached. Please wait a moment and try again.";
                } else if (status >= 500) {
                    cleanMsg = "AI service is temporarily unavailable. Please try again later.";
                }
            } else {
                if (originalMsg.toLowerCase().includes("network")) {
                    cleanMsg = "Network error. Check your internet connection.";
                }
            }

            const cleanError = new Error(cleanMsg);
            if (status) {
                cleanError.status = status;
            }
            throw cleanError;
        }
    }
}

const aiService = new AIService();

/**
 * Main Export
 * Entire app uses this function only
 */

export const generateAIResponse = (prompt, onChunk, jsonMode = false, signal = null, systemPrompt = null) => {

    return aiService.sendMessage(
        prompt,
        onChunk,
        jsonMode,
        signal,
        systemPrompt
    );
};
