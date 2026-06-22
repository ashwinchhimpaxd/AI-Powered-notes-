import { useState, useRef, useEffect } from "react";
import { BarcodeIcon, FilePdfIcon } from '@phosphor-icons/react'
import { useExportPDF } from "./Hooks/useExportPDF"

export function CustomDropdown({ editor }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { exportToPDF } = useExportPDF();

    // Menu for list items 
    const menuItems = [
        {
            label: "Scan Doc", icon: <BarcodeIcon size={20} className="rotate-90 text-purple-300" />, action: () => {
                exportToPDF(editor);
            }
        },
        { label: "Import PDF", icon: <FilePdfIcon size={20} className="text-purple-300" />, action: () => console.log("Sum...") },
        { label: "Export PDF", icon: <FilePdfIcon size={20} className="text-purple-300" />, action: () => exportToPDF(editor) },
    ];
    // Bahar click karne par menu band ho jaye
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative list-items !z-[999]" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center pl-3 transition-all outline-none cursor-pointer">

                <span className="text-[1.8rem] font-semibold text-foreground mb-3">...</span>

            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-56 border border-foreground/10 bg-background/95 backdrop-blur-md rounded-2xl shadow-2xl py-2 z-[100] animate-in fade-in zoom-in duration-200"
                    style={{
                        background: `
                            radial-gradient(ellipse at top left, rgba(59,130,246,0.18) 0%, transparent 65%),
                            radial-gradient(ellipse at bottom right, rgba(168,85,247,0.18) 0%, transparent 65%)
                        `
                    }}
                >
                    <div className="text-[1rem] uppercase font-bold text-purple-400 px-3 pt-1 pb-1">AI Tools</div>
                    <div className="border-t-[0.1px] border-foreground/10 px-1">
                        {menuItems?.map((item, index) => (
                            <button
                                key={index}
                                onClick={item.action}
                                className='w-full cursor-pointer rounded-lg hover:bg-primary/10 text-foreground font-normal flex justify-start items-center gap-2 px-3 py-1'>
                                {item?.icon}
                                <p className='text-lg font-semibold text-foreground'>{item?.label}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}