import { useState, useRef, useCallback } from "react";
import { generateSummary } from "../services/summary.service.js";
import { showToast } from "../utils/showToast.js";

/**
 * Manages summary panel state and AI generation.
 * Editor is stored as a ref via setEditor() to avoid hook-count issues.
 */
export function useAiSummary() {
  const [summaryOpen, setSummaryOpen]       = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryData, setSummaryData]       = useState(null);
  const [summaryError, setSummaryError]     = useState(null);

  const editorRef = useRef(null);
  const setEditor = useCallback((ed) => { editorRef.current = ed; }, []);

  const openSummary  = useCallback(() => setSummaryOpen(true),  []);
  const closeSummary = useCallback(() => setSummaryOpen(false), []);

  const handleSummary = useCallback(async () => {
    setSummaryOpen(true);
    setSummaryLoading(true);
    setSummaryError(null);
    setSummaryData(null);

    try {
      const noteText = editorRef.current?.getText()?.trim() || "";
      const data     = await generateSummary(noteText);
      setSummaryData(data);
    } catch (err) {
      console.error("Summary error:", err);

      const msg    = err?.message || "";
      const status = err?.status ?? err?.statusCode;
      const isShort = msg.toLowerCase().includes("too short");

      if (isShort) {
        showToast("warning", "Note is too short to summarize. Write more content first.");
      } else if (status === 429 || msg.includes("429") || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("rate limit")) {
        showToast("warning", "AI rate limit reached. Please wait a moment and try again.");
      } else if (status >= 500 || msg.includes("503")) {
        showToast("server", "AI service is temporarily unavailable. Please try again shortly.");
      } else if (!navigator.onLine) {
        showToast("network", "No internet connection. Summary requires a network.");
      } else {
        showToast("error", "Failed to generate summary. Please try again.");
      }

      setSummaryError(msg || "Failed to generate summary. Please try again.");
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  return {
    summaryOpen, summaryLoading, summaryData, summaryError,
    openSummary, closeSummary, handleSummary,
    setEditor,
  };
}
