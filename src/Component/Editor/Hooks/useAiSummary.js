import { useState, useRef, useCallback, useEffect } from "react";
import { generateSummary } from "../services/summary.service.js";
import { showToast } from "../utils/showToast.js";

/**
 * Manages summary panel state and AI generation.
 * Editor is stored as a ref via setEditor() to avoid hook-count issues.
 */
export function useAiSummary() {
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryError, setSummaryError] = useState(null);

  const editorRef = useRef(null);
  const abortControllerRef = useRef(null);

  const setEditor = useCallback((ed) => { editorRef.current = ed; }, []);

  const openSummary = useCallback(() => setSummaryOpen(true), []);
  
  const closeSummary = useCallback(() => {
    setSummaryOpen(false);
    // Abort the active request if summary panel is closed
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const handleSummary = useCallback(async () => {
    setSummaryOpen(true);
    setSummaryLoading(true);
    setSummaryError(null);
    setSummaryData(null);

    // Cancel any previous summary request that might be running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const noteText = editorRef.current?.getText()?.trim() || "";
      const data = await generateSummary(noteText, controller.signal);
      setSummaryData(data);
    } catch (err) {
      // Check if error is due to request abort / cancellation
      if (err?.name === "CanceledError" || err?.code === "ERR_CANCELED" || err?.message === "canceled") {
        console.log("Summary request aborted successfully.");
        return; // Silently exit, do not show error/toast
      }

      console.error("Summary error:", err);

      const msg = err?.message || "";
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
      // Reset the controller reference if it belongs to this request execution
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      setSummaryLoading(false);
    }
  }, []);

  // Cancel any active AI summary request if the component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    summaryOpen,
    summaryLoading,
    summaryData,
    summaryError,
    openSummary,
    closeSummary,
    handleSummary,
    setEditor,
  };
}
