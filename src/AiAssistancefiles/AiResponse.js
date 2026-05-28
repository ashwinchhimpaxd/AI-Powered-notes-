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
     * @param {Array} history
     * @param {Function|null} onChunk
     */

    async sendMessage(prompt, history = [], onChunk = null, jsonMode = false, signal = null) {

        try {

            const mappedHistory = history.map(msg => ({
                role:
                    (msg.role || msg.type) === "user"
                        ? "user"
                        : "assistant",

                content: msg.content
            }));

            const messages = [

                {
                    role: "system",
                    content:
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

                ...mappedHistory,

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
                model: "meta/llama-3.1-8b-instruct", //i think is the best model for this project it is fast and advanced
                messages,

                max_tokens: 1024,

                temperature: 0.2,

                top_p: 0.7,

                frequency_penalty: 0,

                presence_penalty: 0,

                stream: isStreaming
            };

            if (jsonMode) {
                payload.response_format = { type: "json_object" };
            }

            /**
             * STREAMING RESPONSE
             */

            if (isStreaming) {

                const response = await axios.post(

                    this.invokeUrl,

                    payload,

                    {
                        headers: {
                            ...this.headers,
                            Accept: "text/event-stream"
                        },
                        responseType: "stream",
                        signal
                    }
                );

                let fullText = "";

                return await new Promise((resolve, reject) => {

                    response.data.on("data", chunk => {

                        const lines =
                            chunk
                                .toString()
                                .split("\n")
                                .filter(line =>
                                    line.trim().startsWith("data:")
                                );

                        for (const line of lines) {

                            const jsonStr =
                                line.replace("data:", "").trim();

                            if (jsonStr === "[DONE]") {
                                resolve(fullText);
                                return;
                            }

                            try {

                                const parsed =
                                    JSON.parse(jsonStr);

                                const content =
                                    parsed
                                        ?.choices?.[0]
                                        ?.delta?.content || "";

                                if (content) {

                                    fullText += content;

                                    onChunk(fullText, content);
                                }

                            } catch (err) {
                                console.error(
                                    "Stream parse error:",
                                    err
                                );
                            }
                        }
                    });

                    response.data.on("end", () => {
                        resolve(fullText);
                    });

                    response.data.on("error", reject);
                });
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

            throw new Error(
                error?.message ||
                "Failed to communicate with AI"
            );
        }
    }
}

const aiService = new AIService();

/**
 * Main Export
 * Entire app uses this function only
 */

export const generateAIResponse = (prompt, history, onChunk, jsonMode = false, signal = null) => {

    return aiService.sendMessage(
        prompt,
        history,
        onChunk,
        jsonMode,
        signal
    );
};