import React, { useState, useRef, useEffect } from 'react';
import { PaperPlaneRight, Plus, ImageIcon, Quotes, MagicWand, FilePdf, Copy, Check } from "@phosphor-icons/react"
import { useSelector } from 'react-redux';
import { sendMessageToAI } from '../AiAssistancefiles/Aimethods/AiassistentLogic.js';
import AICreateNoteAction from './AICreateNoteAction';
import AIEditorContentParser from './AIEditorContentParser';

/**
 * Renders the dedicated AI Assistant chat interface.
 * This component is designed to be placed within a larger dashboard layout.
 */
const AIAssistantChat = ({ isSidebar = false, showPlusIcon = true, editor }) => {

    // Chat messages state
    const [messages, setMessages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedId, setCopiedId] = useState(null);
    const [pendingAction, setPendingAction] = useState(null);

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    // 1. State to hold the current input text
    const [inputText, setInputText] = useState('');

    // 2. Ref to access the textarea DOM element
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    const [showMenu, setShowMenu] = useState(false);

    const handleActionClick = (action) => {
        setShowMenu(false);

        if (!editor) {
            console.warn("Editor actions require an active editor instance.");
            return;
        }

        const editorText = editor.getText().trim();

        if (action === 'Summary Note') {
            const prompt = `Please provide a brief summary of the following note content:\n\n${editorText}`;
            triggerAI(prompt, `Triggered Action: ${action}`);
        } else if (action === 'Write Note') {
            const userActionMsg = {
                type: 'user',
                content: `Triggered Action: ${action}`,
                avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6wvhfHk7dfGClRX5gOj8Y64BF3YcbRgr6AE2p3K3Kpavtmk9lTNsLgIn0SCRtb2E8oQGaO77rqQjC0V4SBWVMJlmj62hnGQpCDvr3BZmxTM2UhPggsUDmpwQH4Fo4NQ_NSm9wJCEyRKH6gZhxqmZ7DnXdlGs4UR5rPhqaYyD0p16DD_dg0iGIA7HD6O7nUV26i5pIJqm5sH0wJ9ZxCf5r9uzQS1YNxRN6d5dq5ugCzLHuS1rFDvQwmIhx5zJ0ofksySAaZNGskt4"
            };

            if (editorText === '') {
                setPendingAction('write_empty');
                setMessages(prev => [...prev, userActionMsg, {
                    type: 'ai',
                    content: 'The editor is currently empty. What topic would you like me to write a note about?'
                }]);
            } else {
                setPendingAction('write_continue');
                setMessages(prev => [...prev, userActionMsg, {
                    type: 'ai',
                    content: 'Your note already has some content. What else would you like me to write or add to it?'
                }]);
            }
            return; // Wait for user input
        } else if (action === 'Improve Notes') {
            const prompt = `Please rewrite and improve the following note. YOU MUST wrap the FULL improved note in HTML format inside [REWRITE_NOTE] and [/REWRITE_NOTE] tags. Do not use conversational filler inside the tags. Note content:\n\n${editorText}`;
            triggerAI(prompt, `Triggered Action: ${action}`);
        } else if (action === "Upload Image") {
            // TODO: Implement actual image upload logic
            const newMessage = { type: 'user', content: 'Uploaded an image', avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6wvhfHk7dfGClRX5gOj8Y64BF3YcbRgr6AE2p3K3Kpavtmk9lTNsLgIn0SCRtb2E8oQGaO77rqQjC0V4SBWVMJlmj62hnGQpCDvr3BZmxTM2UhPggsUDmpwQH4Fo4NQ_NSm9wJCEyRKH6gZhxqmZ7DnXdlGs4UR5rPhqaYyD0p16DD_dg0iGIA7HD6O7nUV26i5pIJqm5sH0wJ9ZxCf5r9uzQS1YNxRN6d5dq5ugCzLHuS1rFDvQwmIhx5zJ0ofksySAaZNGskt4" };
            setMessages(prev => [...prev, newMessage]);
            return;
        } else {
            triggerAI(`Triggered Action: ${action}`, `Triggered Action: ${action}`);
        }
    };

    // ** 3. useEffect Hook for Auto-Grow Functionality **
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const newHeight = textareaRef.current.scrollHeight;
            const minHeight = 48; // Equivalent to h-12
            const maxHeight = 200;
            textareaRef.current.style.height = `${Math.min(Math.max(newHeight, minHeight), maxHeight)}px`;
        }
    }, [inputText]);

    const handleChange = (e) => {
        setInputText(e.target.value);
    };

    const triggerAI = async (actualPrompt, displayUserMessage) => {
        const newMessage = {
            type: 'user',
            content: displayUserMessage,
            avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6wvhfHk7dfGClRX5gOj8Y64BF3YcbRgr6AE2p3K3Kpavtmk9lTNsLgIn0SCRtb2E8oQGaO77rqQjC0V4SBWVMJlmj62hnGQpCDvr3BZmxTM2UhPggsUDmpwQH4Fo4NQ_NSm9wJCEyRKH6gZhxqmZ7DnXdlGs4UR5rPhqaYyD0p16DD_dg0iGIA7HD6O7nUV26i5pIJqm5sH0wJ9ZxCf5r9uzQS1YNxRN6d5dq5ugCzLHuS1rFDvQwmIhx5zJ0ofksySAaZNGskt4"
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
        setIsGenerating(true);

        const aiMessageId = Date.now().toString();

        setMessages(prev => [...prev, {
            type: 'ai',
            content: '',
            id: aiMessageId
        }]);

        // Add context rules to the prompt
        let finalPrompt = actualPrompt;
        let systemPrompt = null;
        if (isSidebar) {
            const currentEditorText = editor ? editor.getText().trim() : "";
            finalPrompt = `[System Context: You are currently assisting the user INSIDE the note editor. DO NOT use the [CREATE_NOTE] tag. Do not suggest creating new notes. 
If the user asks you to add, extend, or write new content for the note, YOU MUST wrap the new HTML content in \`[APPEND_TO_NOTE]\` and \`[/APPEND_TO_NOTE]\` tags. 
If the user asks you to rewrite or improve the entire note, YOU MUST wrap the improved HTML content in \`[REWRITE_NOTE]\` and \`[/REWRITE_NOTE]\` tags.
For general questions or summaries, just answer normally without these tags.
Current editor content for your reference:\n"""\n${currentEditorText}\n"""\n]

User: ${actualPrompt}`;
            systemPrompt = `You are a helpful AI notes assistant assisting the user INSIDE the note editor.
Rules:
- DO NOT suggest or create new notes. Do NOT use the [CREATE_NOTE] tag.
- If the user asks you to add, extend, or write new content for the note, wrap the new HTML content inside [APPEND_TO_NOTE] and [/APPEND_TO_NOTE] tags.
- If the user asks you to rewrite or improve the entire note, wrap the improved HTML content inside [REWRITE_NOTE] and [/REWRITE_NOTE] tags.
- For general questions, summaries, or questions about the note, just answer normally without any tags.
- Keep responses clean, concise, and structured. Use proper HTML tags.`;
        } else {
            finalPrompt = `[System Context: You are currently on the Dashboard. You CAN use the [CREATE_NOTE] tag if requested.]\n\nUser: ${actualPrompt}`;
            systemPrompt = `You are a helpful AI notes assistant on the dashboard.
Rules:
- When the user explicitly asks you to create a note, output it using this exact syntax:
  [CREATE_NOTE]
  {
    "title": "The Note Title",
    "content": "HTML formatted note content"
  }
  [/CREATE_NOTE]
- No markdown code blocks.
- Keep notes clean, structured, and easy to read.`;
        }

        try {
            await sendMessageToAI(finalPrompt, messages, (fullText, chunkText) => {
                setMessages(prev => prev.map(msg =>
                    msg.id === aiMessageId ? { ...msg, content: fullText } : msg
                ));
                setIsGenerating(false);
            }, false, systemPrompt);

        } catch (error) {
            console.error("Failed to get AI response:", error);

            let errorMessage = "Sorry, I'm having trouble understanding you right now.";
            const errorStr = String(error);

            if (errorStr.includes("429") || errorStr.toLowerCase().includes("quota") || errorStr.toLowerCase().includes("exhausted")) {
                errorMessage = "⚠️ API Limit Reached! Gemini API has exhausted its quota. Please try again later.";
            } else if (error.message) {
                errorMessage = `⚠️ Error: ${error.message}`;
            } else {
                errorMessage = `⚠️ Error: ${errorStr}`;
            }

            setMessages(prev => prev.map(msg =>
                msg.id === aiMessageId ? { ...msg, content: errorMessage } : msg
            ));
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSend = () => {
        const text = inputText.trim();
        if (text !== '') {
            if (pendingAction === 'write_empty') {
                const prompt = `Please write a new note about the following topic. YOU MUST wrap the output in [APPEND_TO_NOTE] and [/APPEND_TO_NOTE] tags in HTML format. Topic: ${text}`;
                triggerAI(prompt, text);
                setPendingAction(null);
            } else if (pendingAction === 'write_continue') {
                const prompt = `Please continue writing the note based on the user's instructions. YOU MUST wrap ONLY the new continuation text in [APPEND_TO_NOTE] and [/APPEND_TO_NOTE] tags in HTML format.\n\nUser instructions: ${text}`;
                triggerAI(prompt, text);
                setPendingAction(null);
            } else {
                triggerAI(text, text);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickchataiState = useSelector(state => state.ToggleStates.quickchataiState);

    return (
        <div className={`lg:col-span-2 relative overflow-hidden transition-all duration-300 ease-in-out will-change-height ${isSidebar ? 'h-full' : (quickchataiState ? 'h-[400px]' : 'h-[0px]')}`}>
            {/* Main Chat Container */}
            <div className="flex flex-col h-full bg-white/5 border border-white/10 rounded-lg p-4 shadow-2xl shadow-black/20 backdrop-blur-lg">

                {/* Message Display Area */}
                <div className="flex-1 space-y-4 overflow-y-auto pr-2" id='AI_ASSISTANT_QUICKCHAT'>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}
                        >
                            {/* AI Avatar/Icon (only visible for AI messages) */}
                            {message.type === 'ai' && (
                                <div className="flex-shrink-0 size-8 rounded-full bg-primary/20 flex items-center justify-center border">
                                    <span className="material-symbols-outlined text-primary text-lg border border-black/20 rounded-full p-1 bg-black">
                                        <img src="public\AI Star logo\SparklesAIForChat.svg" alt="" className='w-10 relative' />
                                    </span>
                                </div>
                            )}

                            {/* Message Bubble */}
                            <div className={
                                `px-4 py-3 rounded-lg ${message.type === 'ai'
                                    ? 'bg-white/10 rounded-tl-none'
                                    : 'bg-primary rounded-tr-none text-background-dark'
                                }`
                            }>
                                {message.type === 'ai' && message.content === '' && isGenerating ? (
                                    <div className="flex items-center space-x-1.5 h-5 w-12">
                                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2">
                                        {message.type === 'ai' ? (
                                            isSidebar ? (
                                                <AIEditorContentParser content={message.content} isGenerating={isGenerating} editor={editor} />
                                            ) : (
                                                <AICreateNoteAction content={message.content} isGenerating={isGenerating} />
                                            )
                                        ) : (
                                            <p className={`text-sm whitespace-pre-wrap text-white/70 `}>
                                                {message.content}
                                            </p>
                                        )}
                                        {message.type === 'ai' && message.content && (
                                            <button
                                                onClick={() => handleCopy(message.id || index, message.content)}
                                                className="self-end text-white/40 hover:text-white/100 transition-colors flex items-center gap-1 text-xs mt-1"
                                                title="Copy response"
                                            >
                                                {copiedId === (message.id || index) ? (
                                                    <><Check className="size-4 text-green-400" /> <span className="text-green-400">Copied!</span></>
                                                ) : (
                                                    <Copy className="size-4" />
                                                )}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* User Avatar (only visible for User messages) */}
                            {message.type === 'user' && (
                                <div
                                    className="flex-shrink-0 size-8 rounded-full bg-center bg-cover"
                                    style={{ backgroundImage: `url("${message.avatarUrl}")` }}
                                ></div>
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Field Area */}
                <div className="mt-4 pt-4 border-t border-white/10 relative">
                    <div className="relative flex items-end gap-2">
                        {/* Action Menu Button */}
                        {showPlusIcon && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowMenu(!showMenu)}
                                    className="flex items-center justify-center w-10 h-10 mb-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
                                    title="Actions"
                                >
                                    <Plus className={`size-5 transition-transform duration-300 ${showMenu ? 'rotate-45' : ''}`} />
                                </button>

                                {/* Popup Menu */}
                                {showMenu && (
                                    <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#2a2a2a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100] flex flex-col py-2">
                                        <button onClick={() => handleActionClick('Upload Image')} className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors text-left w-full">
                                            <ImageIcon className="size-5 text-blue-400" /> Upload Image
                                        </button>
                                        <button onClick={() => handleActionClick('Summary Note')} className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors text-left w-full">
                                            <Quotes className="size-5 text-green-400" /> Summary Note
                                        </button>
                                        <button onClick={() => handleActionClick('Write Note')} className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors text-left w-full">
                                            <PaperPlaneRight className="size-5 text-purple-400" /> Write Note
                                        </button>
                                        <button onClick={() => handleActionClick('Improve Notes')} className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors text-left w-full">
                                            <MagicWand className="size-5 text-yellow-400" /> Improve Notes
                                        </button>
                                        <div className="h-[1px] bg-white/10 my-1 mx-2"></div>
                                        <button onClick={() => handleActionClick('Make PDF')} className="flex items-center gap-3 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors text-left w-full">
                                            <FilePdf className="size-5 text-red-400" /> Make PDF
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        <textarea
                            id='Text_Area_SCROLLBAR'
                            ref={textareaRef}
                            value={inputText}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            rows="1"
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-4 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none overflow-y-scroll"
                            placeholder="Ask the AI to do something..."
                        />

                        <button
                            onClick={handleSend}
                            className="absolute right-2 bottom-0 mb-1 mr-1 flex items-center justify-center w-10 h-10 text-white/60 hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-[1.3rem] hover:bg-white/30 hover duration-300 ease-in-out size-9 flex justify-center items-center rounded-full"><PaperPlaneRight fill='white' /></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssistantChat;