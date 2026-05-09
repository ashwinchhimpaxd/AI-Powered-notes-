import { model } from "../../../AiAssistancefiles/geminiset.js";

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
 * Generates a structured summary for the given note text using Gemini.
 * @param {string} noteText - plain text of the note
 * @returns {Promise<{overview: string, keyPoints: string[], actionItems: string[], tone: string}>}
 * @throws {Error} if the note is too short or Gemini fails
 */
export async function generateSummary(noteText) {
  const text = (noteText || "").trim();

  if (text.length < 20) {
    throw new Error("Note is too short to summarize.");
  }

  const result = await model.generateContent(SUMMARY_PROMPT(text));
  const raw    = result.response.text().trim();

  // Strip possible markdown fences that Gemini sometimes adds
  const clean = raw
    .replace(/^```json\n?/, "")
    .replace(/^```\n?/, "")
    .replace(/\n?```$/, "");

  return JSON.parse(clean);
}
