import React, { useState, useRef, useEffect } from 'react';
import { PaperPlaneRight, Plus, ImageIcon, Quotes, MagicWand, FilePdf, Copy, Check } from "@phosphor-icons/react"
import { useSelector } from 'react-redux';
import { sendMessageToAI } from '../AiAssistancefiles/AiMehotds/AiassistentLogic.js';
/**
 * Renders the dedicated AI Assistant chat interface.
 * This component is designed to be placed within a larger dashboard layout.
 */
const AIAssistantChat = ({ isSidebar = false, showPlusIcon = true }) => {

    // Chat messages state
    const [messages, setMessages] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    const handleCopy = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };


    // 1. State to hold the current input text (Required for controlled component)
    const [inputText, setInputText] = useState('');

    // 2. Ref to access the textarea DOM element (Required for auto-grow logic)
    const textareaRef = useRef(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const [showMenu, setShowMenu] = useState(false);

    const handleActionClick = (action) => {
        // Placeholder for actions:
        console.log("Action Triggered: ", action);
        if (action === "Upload Image") {
            // TODO: Implement actual image upload logic
            const newMessage = { type: 'user', content: 'Uploaded an image', avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6wvhfHk7dfGClRX5gOj8Y64BF3YcbRgr6AE2p3K3Kpavtmk9lTNsLgIn0SCRtb2E8oQGaO77rqQjC0V4SBWVMJlmj62hnGQpCDvr3BZmxTM2UhPggsUDmpwQH4Fo4NQ_NSm9wJCEyRKH6gZhxqmZ7DnXdlGs4UR5rPhqaYyD0p16DD_dg0iGIA7HD6O7nUV26i5pIJqm5sH0wJ9ZxCf5r9uzQS1YNxRN6d5dq5ugCzLHuS1rFDvQwmIhx5zJ0ofksySAaZNGskt4" };
            setMessages(prev => [...prev, newMessage]);
        } else {
            const newMessage = { type: 'user', content: `Triggered Action: ${action}`, avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6wvhfHk7dfGClRX5gOj8Y64BF3YcbRgr6AE2p3K3Kpavtmk9lTNsLgIn0SCRtb2E8oQGaO77rqQjC0V4SBWVMJlmj62hnGQpCDvr3BZmxTM2UhPggsUDmpwQH4Fo4NQ_NSm9wJCEyRKH6gZhxqmZ7DnXdlGs4UR5rPhqaYyD0p16DD_dg0iGIA7HD6O7nUV26i5pIJqm5sH0wJ9ZxCf5r9uzQS1YNxRN6d5dq5ugCzLHuS1rFDvQwmIhx5zJ0ofksySAaZNGskt4" };
            setMessages(prev => [...prev, newMessage]);
        }
        setShowMenu(false);
    };



    // ** 3. useEffect Hook for Auto-Grow Functionality **
    useEffect(() => {
        if (textareaRef.current) {
            // Step 1: Reset the height to auto (to shrink if text is deleted)
            textareaRef.current.style.height = 'auto';

            // Step 2: Set the height to the scroll height (to fit the content)
            const newHeight = textareaRef.current.scrollHeight;

            // Set a max height (e.g., 5 lines) to prevent it from growing too large.
            const minHeight = 48; // Equivalent to h-12
            const maxHeight = 200;

            // Set height, ensuring it stays between min and max limits
            textareaRef.current.style.height = `${Math.min(Math.max(newHeight, minHeight), maxHeight)}px`;
        }
    }, [inputText]); // Dependency: Rerun this effect whenever inputText changes

    // Handle input change
    const handleChange = (e) => {
        setInputText(e.target.value);
    };

    // Handle button click (for sending message)
    const handleSend = async () => {
        if (inputText.trim() !== '') {
            const userText = inputText.trim();
            const newMessage = {
                type: 'user',
                content: userText,
                avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6wvhfHk7dfGClRX5gOj8Y64BF3YcbRgr6AE2p3K3Kpavtmk9lTNsLgIn0SCRtb2E8oQGaO77rqQjC0V4SBWVMJlmj62hnGQpCDvr3BZmxTM2UhPggsUDmpwQH4Fo4NQ_NSm9wJCEyRKH6gZhxqmZ7DnXdlGs4UR5rPhqaYyD0p16DD_dg0iGIA7HD6O7nUV26i5pIJqm5sH0wJ9ZxCf5r9uzQS1YNxRN6d5dq5ugCzLHuS1rFDvQwmIhx5zJ0ofksySAaZNGskt4"
            };

            // Add user message
            setMessages(prev => [...prev, newMessage]);
            setInputText(''); // Clear input after sending

            setIsGenerating(true);

            // Generate a unique ID for the AI message
            const aiMessageId = Date.now().toString();

            // Add a placeholder AI message
            setMessages(prev => [...prev, {
                type: 'ai',
                content: '',
                id: aiMessageId
            }]);

            try {
                // Pass current messages as history, and a callback to handle stream chunks
                await sendMessageToAI(userText, messages, (currentText) => {
                    setMessages(prev => prev.map(msg =>
                        msg.id === aiMessageId ? { ...msg, content: currentText } : msg
                    ));

                    // Once we start getting text, we can turn off the "isGenerating" typing indicator
                    setIsGenerating(false);
                });
            } catch (error) {
                console.error("Failed to get AI response:", error);
                setMessages(prev => prev.map(msg =>
                    msg.id === aiMessageId ? { ...msg, content: "Sorry, I'm having trouble understanding you right now." } : msg
                ));
            } finally {
                setIsGenerating(false);
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
                <div className="flex-1 space-y-4 overflow-y-auto pr-2  " id='AI_ASSISTANT_QUICKCHAT'>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={` flex items-start gap-3 ${message.type === 'user' ? 'justify-end' : ''}`}
                        >
                            {/* AI Avatar/Icon (only visible for AI messages) */}
                            {message.type === 'ai' && (
                                <div className="flex-shrink-0 size-8 rounded-full bg-primary/20 flex items-center justify-center border">
                                    <span className="material-symbols-outlined text-primary text-lg  border border-black/20  rounded-full p-1 bg-black">

                                        <img src="public\AI Star logo\SparklesAIForChat.svg" alt="" className='w-10 relative' />
                                    </span>
                                </div>
                            )}

                            {/* Message Bubble */}
                            <div className={
                                `px-4 py-3 rounded-lg   ${message.type === 'ai'
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
                                        <p className={`text-sm whitespace-pre-wrap ${message.type === 'user' ? 'text-white/70' : 'text-white'} `}>
                                            {message.content}
                                        </p>
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

                {/* MODIFIED: Input Field replaced with Auto-Growing Textarea */}
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
                            ref={textareaRef} // Attach the ref
                            value={inputText}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            rows="1" // Start with 1 row
                            className="w-full  bg-white/5 border border-white/10 rounded-lg py-3 pl-4 pr-12 text-white placeholder:text-white/40 focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none overflow-y-scroll"
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