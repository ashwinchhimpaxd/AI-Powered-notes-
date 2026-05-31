import { generateAIResponse } from "../../../AiAssistancefiles/AiResponse.js";
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
const EDITOR_SYSTEM_PROMPT = `You are a helpful AI assistant built directly into a rich text editor.
Your job is to assist with text editing, rewriting, formatting, and generation.

Rules:
- The input text you receive is in HTML format. You MUST preserve the rich structure (headings, bold text, lists) and return your response in clean, semantic HTML format (using <h2>, <h3>, <strong>, <ul>, <ol>, <li>, <p>).
- Respond ONLY with the requested content or edits in HTML format.
- Do NOT include any conversational filler (e.g., "Here is your text:").
- Do NOT wrap your response in markdown code blocks (do NOT use \`\`\`html or \`\`\`markdown).
- Do NOT use custom tags like [CREATE_NOTE], [APPEND_TO_NOTE], or [REWRITE_NOTE].
- Keep the HTML well-structured and clean.`;

export function cleanHtmlResponse(text) {
  if (!text) return "";
  let clean = text.trim();

  // Strip markdown code block wrappers if the AI accidentally wraps the HTML
  clean = clean.replace(/^```html\s*/i, "");
  clean = clean.replace(/```$/g, "");
  clean = clean.replace(/```/g, "");

  return clean;
}

export async function runAiCommand(commandId, commandLabel, commandMode, noteText, onChunk = null) {
  console.log(commandId)
  console.log(commandLabel)
  console.log(commandMode)
  console.log(noteText)
  const prompt = buildPrompt(commandId, noteText);

  if (onChunk) {
    const resultText = await generateAIResponse(
      prompt,
      undefined,
      (fullText) => {
        onChunk(fullText);
      },
      false,
      null,
      EDITOR_SYSTEM_PROMPT
    );
    return cleanHtmlResponse(resultText);
  } else {
    const resultText = await generateAIResponse(prompt, undefined, undefined, false, null, EDITOR_SYSTEM_PROMPT);
    const bodyHtml = cleanHtmlResponse(resultText);

    if (commandMode === "replace") {
      // Clean content — no header, replaces the whole note
      return `${bodyHtml}<p></p>`;
    }

    // Append mode — include labelled header to separate from existing content
    return `<p><strong style="color:#a78bfa">✦ ${commandLabel}</strong></p>${bodyHtml}<p></p>`;
  }
}
