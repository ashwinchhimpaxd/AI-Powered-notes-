import React, { useState } from "react";
import { CaretDown } from "@phosphor-icons/react";

// ─── Shared colour data ────────────────────────────────────────────────────

export const HIGHLIGHT_COLORS = [
    { color: "#ef4444" },
    { color: "#16a34a" },
    { color: "#3b82f6" },
    { color: "#a78bfa" },
    { color: "#fcd34d" },
];

export const TEXT_COLORS = [
    { color: "#000000" },
    { color: "#ffffff" },
    { color: "#ef4444" },
    { color: "#16a34a" },
    { color: "#3b82f6" },
    { color: "#a78bfa" },
    { color: "#f97316" },
];

export const FONT_SIZES = [
    "12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px",
];

// ─── Shared class strings ─────────────────────────────────────────────────

const BTN_BASE =
    "cursor-pointer text-[1.2rem] px-2 py-1.5 rounded-md transition-colors text-white hover:bg-white/10";

const POPOVER_BASE =
    "absolute top-full mt-0 left-1/2 -translate-x-1/2 border border-white/10 shadow-lg rounded p-1 flex bg-[#2a2a2a] gap-2 cursor-pointer z-[100]";

const COLOR_SWATCH =
    "cursor-pointer h-6 w-6 rounded-md border border-white/20 hover:scale-110 transition-transform";

// ─── ToolbarButton ────────────────────────────────────────────────────────
// Plain icon button — used for Bold, Italic, H1, Bullet, etc.

export function ToolbarButton({ icon, label, onClick }) {
    return (
        <button
            className={BTN_BASE}
            onClick={onClick}
            title={label}
        >
            {icon}
        </button>
    );
}

// ─── HighlightPicker ──────────────────────────────────────────────────────

export function HighlightPicker({ icon, onPick, isOpen, onToggle }) {
    const pick = (color) => {
        onPick(color);
    };

    return (
        <div className="relative">
            <button className={BTN_BASE} onClick={onToggle} title="Highlight">
                {icon}
            </button>
            {isOpen && (
                <div className={POPOVER_BASE}>
                    {HIGHLIGHT_COLORS.map((c) => (
                        <button
                            key={c.color}
                            className={COLOR_SWATCH}
                            style={{ backgroundColor: c.color }}
                            onClick={() => pick(c)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ─── ColorPicker ──────────────────────────────────────────────────────────

export function ColorPicker({ icon, onPick, isOpen, onToggle }) {
    const pick = (color) => {
        onPick(color);
    };

    return (
        <div className="relative">
            <button className={BTN_BASE} onClick={onToggle} title="Text color">
                {icon}
            </button>
            {isOpen && (
                <div
                    className={`${POPOVER_BASE} flex-wrap w-[150px]`}
                >
                    {TEXT_COLORS.map((c) => (
                        <button
                            key={c.color}
                            className={COLOR_SWATCH}
                            style={{ backgroundColor: c.color }}
                            onClick={() => pick(c)}
                        />
                    ))}
                    {/* Custom colour via native colour picker */}
                    <input
                        type="color"
                        className="cursor-pointer h-6 w-6 rounded-md border border-white/20 p-0"
                        onChange={(e) => pick({ color: e.target.value })}
                    />
                </div>
            )}
        </div>
    );
}

// ─── LinkInput ────────────────────────────────────────────────────────────

export function LinkInput({ icon, currentHref, onSave, isOpen, onToggle }) {
    const [url, setUrl] = useState(currentHref || "");

    // When popover opens or currentHref changes, sync the local input
    React.useEffect(() => {
        if (isOpen) setUrl(currentHref || "");
    }, [isOpen, currentHref]);

    const save = () => {
        onSave(url);
    };

    return (
        <div className="relative">
            <button className={BTN_BASE} onClick={onToggle} title="Insert link">
                {icon}
            </button>
            {isOpen && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 border border-white/10 shadow-lg rounded p-2 flex bg-[#2a2a2a] gap-2 z-[100] min-w-[250px] items-center">
                    <input
                        type="url"
                        placeholder="Paste link here..."
                        className="flex-1 bg-transparent border-b border-white/20 text-white text-sm outline-none px-1 py-1"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && save()}
                        autoFocus
                    />
                    <button
                        className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1.5 rounded cursor-pointer transition-colors"
                        onClick={save}
                    >
                        Add
                    </button>
                </div>
            )}
        </div>
    );
}

// ─── FontSizeDropdown ─────────────────────────────────────────────────────

export function FontSizeDropdown({ currentSize, onPick, isOpen, onToggle }) {
    const pick = (size) => {
        onPick(size);
    };

    return (
        <div className="flex flex-col items-center justify-between border-r-[1px] border-white/10 px-6 h-full min-w-max relative">
            <div className="flex gap-1 items-center justify-center flex-1">
                <button
                    className="flex items-center gap-2 text-white text-sm px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors border border-white/20 bg-white/5"
                    onClick={onToggle}
                >
                    <span>{currentSize || "Size"}</span>
                    <CaretDown weight="bold" />
                </button>
                {isOpen && (
                    <div className="absolute top-[60%] mt-2 left-4 border border-white/10 rounded-md py-1 flex flex-col bg-[#2a2a2a] w-24 z-[110] shadow-2xl max-h-48 overflow-y-auto">
                        {FONT_SIZES.map((size) => (
                            <button
                                key={size}
                                className="text-white text-sm hover:bg-blue-600 w-full text-left px-4 py-1.5 transition-colors"
                                onClick={() => pick(size)}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <span className="text-[10px] text-white/50 uppercase tracking-wider font-semibold mt-3 mb-1">
                Size
            </span>
        </div>
    );
}