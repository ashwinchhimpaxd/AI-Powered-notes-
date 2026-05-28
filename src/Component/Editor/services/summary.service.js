import { generateAIResponse } from "../../../AiAssistancefiles/AiResponse.js";

const SUMMARY_PROMPT = (text) => `Analyze the following note and respond with a JSON object (no markdown code block, raw JSON only) in this exact shape:
{
  "overview": "2-3 sentence plain-language summary",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "actionItems": ["action 1", "action 2"],
  "tone": "Informative / Technical / Creative / etc."
}

NOTE CONTENT:
${text.slice(0, 4000)}`;

/**
 * Generates a structured summary for the given note text using the configured AI service.
 * @param {string} noteText - plain text of the note
 * @returns {Promise<{overview: string, keyPoints: string[], actionItems: string[], tone: string}>}
 * @throws {Error} if the note is too short or AI fails
 */
export async function generateSummary(noteText, signal = null) {
  const text = (noteText || "").trim();

  if (text.length < 20) {
    throw new Error("Note is too short to summarize.");
  }

  // Use the loosely-coupled AI interface
  const responseText = await generateAIResponse(SUMMARY_PROMPT(text), undefined, undefined, false, signal);

  const raw = (responseText || "").trim();

  // Extract JSON via regex to be safe against conversational filler
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  const clean = jsonMatch ? jsonMatch[0] : raw;

  try {
    return JSON.parse(clean);
  } catch (error) {
    console.error("Failed to parse AI summary JSON:", raw);
    throw new Error("AI returned an invalid response format.");
  }
}
