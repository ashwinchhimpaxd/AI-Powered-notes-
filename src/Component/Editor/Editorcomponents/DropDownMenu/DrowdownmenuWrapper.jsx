import { useState, useRef, useEffect } from "react";
import { BarcodeIcon, FilePdfIcon } from '@phosphor-icons/react'
import { useExportPDF } from "./Hooks/useExportPDF"
import { showToast } from "../../utils/showToast";
import { handleError } from "../../../../utils/errorHandler";

export function CustomDropdown({ editor }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const dropdownRef = useRef(null);
    const fileInputRef = useRef(null); // 1. Input ke liye ref banaya
    const { exportToPDF } = useExportPDF();

    // File select hone par ye function chalega
    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsExtracting(true);
        const formData = new FormData();

        // 1. Mandatory Parameter
        formData.append('apikey', 'K83065113688957'); // Apna key yahan daalo

        // 2. Input Method (File upload)
        formData.append('file', file);

        // 3. Useful Optional Parameters
        formData.append('language', 'eng');          // Default English
        formData.append('isOverlayRequired', 'false'); // Agar sirf text chahiye, toh false rakho (faster)
        formData.append('isTable', 'true');          // Agar receipt ya table scan kar rahe ho
        formData.append('OCREngine', '3');           // Engine 2 better hai (automatic lang detection ke liye)

        try {
            const response = await fetch('https://api.ocr.space/parse/image', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok (status: ${response.status})`);
            }

            const result = await response.json();
            console.log("OCR Result:", result);

            if (result.OCRExitCode === 1) {
                const parsedText = result.ParsedResults?.[0]?.ParsedText;
                if (parsedText) {
                    editor.commands.insertContent(parsedText);
                    showToast("success", "Text extracted successfully!");
                } else {
                    showToast("warning", "No text found in the image.");
                }
            } else {
                const ocrErrorMessage = result.ErrorMessage?.[0] || result.ErrorMessage || "Failed to extract text from image.";
                const errorObj = new Error(ocrErrorMessage);
                handleError(errorObj, { action: "Image text extraction API response" });
            }
        } catch (error) {
            handleError(error, { action: "Extracting text from image" });
        } finally {
            setIsExtracting(false);
            if (e.target) e.target.value = ''; // Input clear reset
        }
    };



    // Menu for list items 
    const menuItems = [
        {
            label: isExtracting ? "Extracting..." : "Scan Doc",
            icon: isExtracting ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <BarcodeIcon size={20} className="rotate-90 text-purple-300" />
            ),
            action: isExtracting ? null : () => {
                setIsOpen(false);
                fileInputRef.current.click();
            }
        },
        { label: "Import PDF", icon: <FilePdfIcon size={20} className="text-purple-300" />, action: () => console.log("Sum...") },
        {
            label: "Export PDF", icon: <FilePdfIcon size={20} className="text-purple-300" />, action: () => {
                const text = editor.getText().trim();
                if (!text) {
                    showToast("warning", "Note is empty to make PDF");
                    return;
                }
                exportToPDF(editor);
            }
        },
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

            {/* Hidden Input Tag */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                capture="environment" // Mobile ke liye direct camera
                className="hidden"
            />

            <button
                disabled={isExtracting}
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center pl-3 transition-all outline-none cursor-pointer">
                {isExtracting ? (
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mb-1"></div>
                ) : (
                    <span className="text-[1.8rem] font-semibold text-foreground mb-3">...</span>
                )}
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
                                disabled={item.action === null}
                                className={`w-full cursor-pointer rounded-lg hover:bg-primary/10 text-foreground font-normal flex justify-start items-center gap-2 px-3 py-1 ${item.action === null ? 'opacity-50 cursor-not-allowed' : ''}`}>
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