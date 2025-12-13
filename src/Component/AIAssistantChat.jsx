import React, { useState, useRef, useEffect } from 'react';
import { PaperPlaneRight } from "@phosphor-icons/react"
import { useSelector } from 'react-redux';
/**
 * Renders the dedicated AI Assistant chat interface.
 * This component is designed to be placed within a larger dashboard layout.
 */
const AIAssistantChat = () => {
    // 1. State to hold the current input text (Required for controlled component)
    const [inputText, setInputText] = useState('');

    // 2. Ref to access the textarea DOM element (Required for auto-grow logic)
    const textareaRef = useRef(null);

    // Hardcoded chat messages derived from the original HTML structure
    const messages = [
        {
            type: 'ai',
            content: 'Hello! How can I help you manage your notes today? You can ask me to create a new note, summarize text, or expand on an idea.',
        },
        {
            type: 'user',
            content: 'Create a new note about the benefits of AI in project management',
            avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6wvhfHk7dfGClRX5gOj8Y64BF3YcbRgr6AE2p3K3Kpavtmk9lTNsLgIn0SCRtb2E8oQGaO77rqQjC0V4SBWVMJlmj62hnGQpCDvr3BZmxTM2UhPggsUDmpwQH4Fo4NQ_NSm9wJCEyRKH6gZhxqmZ7DnXdlGs4UR5rPhqaYyD0p16DD_dg0iGIA7HD6O7nUV26i5pIJqm5sH0wJ9ZxCf5r9uzQS1YNxRN6d5dq5ugCzLHuS1rFDvQwmIhx5zJ0ofksySAaZNGskt4",
        },
        {
            type: 'ai',
            content: "Of course. I've created a new draft. It covers improved efficiency, better resource allocation, and predictive analytics for risk management. Would you like to add anything else?",
        },
        {
            type: 'user',
            content: 'Create a new note about the benefits of AI in project management',
            avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6wvhfHk7dfGClRX5gOj8Y64BF3YcbRgr6AE2p3K3Kpavtmk9lTNsLgIn0SCRtb2E8oQGaO77rqQjC0V4SBWVMJlmj62hnGQpCDvr3BZmxTM2UhPggsUDmpwQH4Fo4NQ_NSm9wJCEyRKH6gZhxqmZ7DnXdlGs4UR5rPhqaYyD0p16DD_dg0iGIA7HD6O7nUV26i5pIJqm5sH0wJ9ZxCf5r9uzQS1YNxRN6d5dq5ugCzLHuS1rFDvQwmIhx5zJ0ofksySAaZNGskt4",
        },
        {
            type: 'ai',
            content: "Of course. I've created a new draft. It covers improved efficiency, better resource allocation, and predictive analytics for risk management. Would you like to add anything else?",
        },
        {
            type: 'user',
            content: 'Create a new note about the benefits of AI in project management',
            avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6wvhfHk7dfGClRX5gOj8Y64BF3YcbRgr6AE2p3K3Kpavtmk9lTNsLgIn0SCRtb2E8oQGaO77rqQjC0V4SBWVMJlmj62hnGQpCDvr3BZmxTM2UhPggsUDmpwQH4Fo4NQ_NSm9wJCEyRKH6gZhxqmZ7DnXdlGs4UR5rPhqaYyD0p16DD_dg0iGIA7HD6O7nUV26i5pIJqm5sH0wJ9ZxCf5r9uzQS1YNxRN6d5dq5ugCzLHuS1rFDvQwmIhx5zJ0ofksySAaZNGskt4",
        },
        {
            type: 'ai',
            content: "Of course. I've created a new draft. It covers improved efficiency, better resource allocation, and predictive analytics for risk management. Would you like to add anything else?",
        },
        {
            type: 'user',
            content: 'Create a new note about the benefits of AI in project management',
            avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD6wvhfHk7dfGClRX5gOj8Y64BF3YcbRgr6AE2p3K3Kpavtmk9lTNsLgIn0SCRtb2E8oQGaO77rqQjC0V4SBWVMJlmj62hnGQpCDvr3BZmxTM2UhPggsUDmpwQH4Fo4NQ_NSm9wJCEyRKH6gZhxqmZ7DnXdlGs4UR5rPhqaYyD0p16DD_dg0iGIA7HD6O7nUV26i5pIJqm5sH0wJ9ZxCf5r9uzQS1YNxRN6d5dq5ugCzLHuS1rFDvQwmIhx5zJ0ofksySAaZNGskt4",
        },
    ];

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
    const handleSend = () => {
        if (inputText.trim() !== '') {
            console.log('Sending message:', inputText);
            // In a real app, you would handle the message submission here
            setInputText(''); // Clear input after sending
        }
    };

    const quickchataiState = useSelector(state => state.QuickChatAI.quickchataiState);
    console.log(quickchataiState)
    return (


        <div className={`lg:col-span-2 relative overflow-hidden transition-all duration-300 ease-in-out will-change-height ${quickchataiState ? 'h-[400px]' : 'h-[0px]'}`}>
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
                                    <span className="material-symbols-outlined text-primary text-lg  border border-black/20 border-primary rounded-full p-1 bg-black">

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
                                <p className={`text-sm ${message.type === 'user' ? 'font-medium' : 'text-white'} `}>
                                    {message.content}
                                </p>
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
                </div>

                {/* MODIFIED: Input Field replaced with Auto-Growing Textarea */}
                <div className="mt-4 pt-4 border-t border-white/10 relative">
                    <div className="relative flex items-end">
                        {/* We use items-end to align the button to the bottom of the textarea */}

                        <textarea
                            id='Text_Area_SCROLLBAR'
                            ref={textareaRef} // Attach the ref
                            value={inputText}
                            onChange={handleChange}
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