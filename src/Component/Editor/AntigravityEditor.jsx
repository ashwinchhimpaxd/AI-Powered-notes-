import React, { useEffect } from "react";

// ── Hooks ──────────────────────────────────────────────────────────────────
import { useSlashCommands } from "./Hooks/useSlashCommands.js";
import { useAiSummary } from "./Hooks/useAiSummary.js";
import { useTiptapEditor } from "./Hooks/useTiptapEditor.js";
import { useNoteSave } from "./DataSetterMethodonappwrite/Usenotesave.js";

// ── UI Components ──────────────────────────────────────────────────────────
import EditorTopbar from "./Editorcomponents/EditorTopbar.jsx";
import EditorCanvas from "./Editorcomponents/EditorCanvas.jsx";
import SlashCommandMenu from "./Editorcomponents/SlashCommandMenu.jsx";
import AiLoadingOverlay from "./Editorcomponents/AiLoadingOverlay.jsx";
import SummaryPanel from "./Editorcomponents/SummaryPanel.jsx";
import whyDidYouRender from "@welldone-software/why-did-you-render";

/**
 * AntigravityEditor — clean orchestrator.
 *
 * Each hook is called exactly once.
 * No business logic lives here — only wiring.
 */
export default function AntigravityEditor({ onEditorReady }) {

  // 1. Slash commands (initialised first — exposes stable refs for useTiptapEditor)
  const slash = useSlashCommands();

  // 2. Summary (same pattern — editor injected via setEditor after init)
  const summary = useAiSummary();

  // 3. Editor — receives stable callback refs from slash so it never recreates
  const { editor } = useTiptapEditor({
    onSlashOpenRef: slash.onSlashOpenRef,
    onSlashQueryRef: slash.onSlashQueryRef,
    onSlashCloseRef: slash.onSlashCloseRef,
    slashOpenRef: slash.slashOpenRef,
    onEditorReady,
  });

  // 4. Once the editor is ready, inject it into the hooks that need it
  useEffect(() => {
    if (!editor) return;
    slash.setEditor(editor);
    summary.setEditor(editor);
  }, [editor]); // eslint-disable-line react-hooks/exhaustive-deps

  // 5. Save (autosave + manual + title)
  const { title, setTitle, isSaving, isNoteSaved, commitTitle, handleSave } = useNoteSave(editor, slash.slashOpenRef);

  if (!editor) return null;

  return (
    <div className="relative w-full min-h-screen bg-background text-foreground flex justify-center font-sans overflow-x-hidden ">

      {/* Ambient background glows */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/8 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/8 blur-[120px] rounded-full pointer-events-none z-0" />

      <EditorTopbar
        title={title}
        setTitle={setTitle}
        commitTitle={commitTitle}
        isSaving={isSaving}
        isNoteSaved={isNoteSaved}
        onSave={() => handleSave(editor)}
        onSummary={summary.handleSummary}
      />

      <EditorCanvas editor={editor} />

      <SlashCommandMenu
        open={slash.slashMenuOpen}
        coords={slash.slashCoords}
        query={slash.slashQuery}
        commands={slash.filteredCommands}
        onSelect={slash.handleCommand}
        onClose={slash.closeSlash}
      />

      <AiLoadingOverlay
        loading={slash.aiLoading}
        status={slash.aiStatus}
      />

      <SummaryPanel
        open={summary.summaryOpen}
        loading={summary.summaryLoading}
        data={summary.summaryData}
        error={summary.summaryError}
        onClose={summary.closeSummary}
        onGenerate={summary.handleSummary}
      />
    </div>
  );
}
