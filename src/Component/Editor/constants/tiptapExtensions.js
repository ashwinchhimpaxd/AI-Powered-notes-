import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";

/**
 * Returns a stable array of Tiptap extensions.
 * Defined outside any component so the array reference never changes between renders,
 * preventing the editor from being torn down and recreated on every re-render.
 */
export const TIPTAP_EXTENSIONS = [
  StarterKit.configure({
    blockquote: {
      HTMLAttributes: { class: "my-6" },
    },
    heading: { levels: [1, 2, 3] },
  }),
  Highlight.configure({
    HTMLAttributes: { class: "bg-yellow-200 dark:bg-yellow-500/30 text-foreground dark:text-yellow-200  px-1 py-0.5" },
  }),
  Image.configure({
    inline: true,
    HTMLAttributes: { class: "rounded-xl border border-border shadow-2xl my-8 max-w-full" },
  }),
  TextStyle,
  Color,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Placeholder.configure({
    placeholder: 'Start typing here . . .   Press "/ " to use AI tools',
  }),
];
