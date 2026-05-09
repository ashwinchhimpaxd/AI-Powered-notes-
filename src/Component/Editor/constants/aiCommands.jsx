import React from "react";
import {
  Sparkle, MagicWand, TextAa, CaretRight, Textbox,
  LinkSimple, ChatTeardropText, List, ListBullets,
  TextB, Quotes, TextHOne,
} from "@phosphor-icons/react";

/**
 * mode: "replace" → AI output REPLACES the entire note content (old text is removed)
 * mode: "append"  → AI output is INSERTED after the current cursor position
 */
export const AI_COMMANDS = [
  // ── REPLACE commands (edit / transform existing content) ───────────────
  { id: "improve",    mode: "replace", icon: <Sparkle weight="fill" />,   label: "Improve Writing",          description: "Enhance clarity and flow" },
  { id: "rewrite",    mode: "replace", icon: <MagicWand weight="fill" />, label: "Rewrite Professionally",   description: "More professional tone" },
  { id: "shorten",    mode: "replace", icon: <TextAa />,                  label: "Shorten Text",             description: "Make it concise" },
  { id: "expand",     mode: "replace", icon: <TextAa />,                  label: "Expand Topic",             description: "Add more details" },
  { id: "grammar",    mode: "replace", icon: <TextB />,                   label: "Fix Grammar",              description: "Correct grammar and spelling" },
  { id: "tone",       mode: "replace", icon: <MagicWand />,               label: "Change Tone",              description: "Make it conversational" },
  { id: "simplify",   mode: "replace", icon: <TextAa />,                  label: "Simplify Language",        description: "Easier to read" },
  { id: "translate",  mode: "replace", icon: <ChatTeardropText />,        label: "Translate",                description: "Translate to another language" },
  { id: "bullets",    mode: "replace", icon: <List />,                    label: "Convert to Bullet Points", description: "Format as a list" },

  // ── APPEND commands (generate new sections added to the note) ──────────
  { id: "continue",   mode: "append",  icon: <CaretRight />,              label: "Continue Writing",         description: "AI writes the next part" },
  { id: "notes",      mode: "append",  icon: <Textbox />,                 label: "Add Important Notes",      description: "Highlight key takeaways" },
  { id: "related",    mode: "append",  icon: <LinkSimple />,              label: "Add Related Topics",       description: "Suggest what to write next" },
  { id: "explain",    mode: "append",  icon: <ChatTeardropText />,        label: "Explain This",             description: "Explain in simple terms" },
  { id: "summarize",  mode: "append",  icon: <ListBullets />,             label: "Summarize Section",        description: "Brief overview" },
  { id: "flashcards", mode: "append",  icon: <Textbox />,                 label: "Generate Flashcards",      description: "Q&A cards from the text" },
  { id: "studynotes", mode: "append",  icon: <TextHOne />,                label: "Create Study Notes",       description: "Structured study material" },
  { id: "conclusion", mode: "append",  icon: <Quotes />,                  label: "Add Conclusion",           description: "Write a closing paragraph" },
  { id: "title",      mode: "append",  icon: <TextHOne />,                label: "Generate Title",           description: "Suggest a note title" },
  { id: "actions",    mode: "append",  icon: <ListBullets />,             label: "Create Action Items",      description: "Extract to-do list" },
  { id: "quiz",       mode: "append",  icon: <Sparkle />,                 label: "Generate Quiz",            description: "Create quiz questions" },
  { id: "examples",   mode: "append",  icon: <CaretRight />,              label: "Generate Examples",        description: "Add real-world examples" },
];
