import { model } from "../../../AiAssistancefiles/geminiset.js";
import { buildPrompt } from "../utils/buildPrompt.js";
import { parseAiResponse } from "../utils/parseAiResponse.js";

/**
 * Runs an AI slash command and returns the HTML ready for the editor.
 *
 * For "replace" commands (improve, grammar, rewrite, etc.) the returned HTML
 * is clean content with NO label header — it becomes the entire note.
 *
 * For "append" commands (continue, flashcards, etc.) the returned HTML
 * includes a "✦ Label" header so it's visually separated from existing content.
 *
 * @param {string} commandId    - e.g. "improve"
 * @param {string} commandLabel - e.g. "Improve Writing"
 * @param {string} commandMode  - "replace" | "append"
 * @param {string} noteText     - plain text of the full note
 * @returns {Promise<string>} HTML string
 */
export async function runAiCommand(commandId, commandLabel, commandMode, noteText) {
  const prompt = buildPrompt(commandId, noteText);
  const streamResult = await model.generateContentStream(prompt);

  let accumulated = "";
  for await (const chunk of streamResult.stream) {
    accumulated += chunk.text();
  }

  const bodyHtml = parseAiResponse(accumulated);

  if (commandMode === "replace") {
    // Clean content — no header, replaces the whole note
    return `${bodyHtml}<p></p>`;
  }

  // Append mode — include labelled header to separate from existing content
  return `<p><strong style="color:#a78bfa">✦ ${commandLabel}</strong></p>${bodyHtml}<p></p>`;
}
