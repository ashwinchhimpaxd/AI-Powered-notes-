/**
 * Converts a plain-text Gemini response into minimal Tiptap-compatible HTML.
 * Handles:
 *  - bullet lists  (lines starting with "• " or "- ")
 *  - ordered lists (lines starting with "1. ", "2. ", …)
 *  - Q:/A: pairs   (rendered as bold paragraphs)
 *  - blank lines   (close open list, skip)
 *  - everything else → <p>
 *
 * @param {string} text - raw text returned by Gemini
 * @returns {string} HTML string ready for editor.insertContent()
 */
export function parseAiResponse(text) {
  const lines = (text || "").split("\n");
  let html = "";
  let inUl = false;
  let inOl = false;

  const closeList = () => {
    if (inUl) { html += "</ul>"; inUl = false; }
    if (inOl) { html += "</ol>"; inOl = false; }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      closeList();
      continue;
    }

    if (line.startsWith("• ") || line.startsWith("- ")) {
      if (inOl) { html += "</ol>"; inOl = false; }
      if (!inUl) { html += "<ul>"; inUl = true; }
      html += `<li>${line.slice(2)}</li>`;
    } else if (/^\d+\.\s/.test(line)) {
      if (inUl) { html += "</ul>"; inUl = false; }
      if (!inOl) { html += "<ol>"; inOl = true; }
      html += `<li>${line.replace(/^\d+\.\s/, "")}</li>`;
    } else {
      closeList();
      if (line.startsWith("Q:") || line.startsWith("A:")) {
        html += `<p><strong>${line}</strong></p>`;
      } else {
        html += `<p>${line}</p>`;
      }
    }
  }

  closeList();
  return html;
}
