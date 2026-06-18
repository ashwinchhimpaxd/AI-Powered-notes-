import SideNavBar from "../Component/Navbar";
import NoteStatistics from "../Component/AIActivity";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { resetcurrentnoteinfo } from "../redux/currentnoteinfoslice/currentnoteinfoslice";
import { MagnifyingGlass, Sparkle, List } from "@phosphor-icons/react";
import { sendMessageToAI } from "../AiAssistancefiles/Aimethods/AiassistentLogic.js";
import service from "@/AppWrite/Setgetuserdatas/config.js";
import { handleError } from "../utils/errorHandler.js";
import { addNoteToTop } from "../redux/NotesCreation/NotesCreationSlice.js";
import { showToast } from "../Component/Editor/utils/showToast.js";
import { Outlet } from "react-router-dom";
const extractStreamedTitle = (streamedText) => {
    const match = streamedText.match(/"title"\s*:\s*"([^"]*)"?/);
    return match ? match[1] : "";
};

const extractStreamedContent = (streamedText) => {
    const match = streamedText.match(/"content"\s*:\s*"([\s\S]*)/);
    if (!match) return "";
    let contentVal = match[1];
    contentVal = contentVal.replace(/"\s*\}?\s*$/, "");
    return contentVal
        .replace(/\\n/g, "\n")
        .replace(/\\"/g, '"')
        .replace(/\\t/g, "\t")
        .replace(/\\r/g, "\r");
};

/**
 * Safely sanitizes a raw JSON string returned by AI,
 * escaping unescaped literal control characters (newlines, carriage returns, tabs)
 * ONLY inside double-quoted string values, while preserving structural spacing outside strings.
 */

export default function Dashboard2() {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.UserAuthantication.UserData);

    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [isAiMode, setIsAiMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Animation states for sliding text
    const [slideText, setSlideText] = useState("");
    const [showSlideText, setShowSlideText] = useState(false);

    // Note generation state
    const [isCreatingNote, setIsCreatingNote] = useState(false);

    const sanitizeJsonString = (rawStr) => {
        let inString = false;
        let result = "";
        for (let i = 0; i < rawStr.length; i++) {
            const char = rawStr[i];
            if (char === '"' && (i === 0 || rawStr[i - 1] !== '\\')) {
                inString = !inString;
                result += char;
            } else if (inString) {
                if (char === '\n') {
                    result += '\\n';
                } else if (char === '\r') {
                    result += '\\r';
                } else if (char === '\t') {
                    result += '\\t';
                } else {
                    result += char;
                }
            } else {
                result += char;
            }
        }
        return result.trim();
    };

    // handle search debouncing and ai mode
    useEffect(() => {
        // AI mode me debounce mat chalao
        if (isAiMode) {
            setDebouncedSearchQuery("");
            return;
        }
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => clearTimeout(timer);

    }, [searchQuery, isAiMode]);


    // this is to reset the current note info when the component is mounted
    useEffect(() => {
        dispatch(resetcurrentnoteinfo());
    }, [dispatch]);




    // Handle AI Toggle
    const handleToggleAiMode = () => {
        const newMode = !isAiMode;
        setIsAiMode(newMode);

        // Trigger sliding animation text
        setSlideText(newMode ? "AI mode ON" : "AI mode OFF");
        setShowSlideText(true);

        // Hide it after a short delay
        setTimeout(() => {
            setShowSlideText(false);
        }, 2500);
    };

    // Handle AI Note Generation on Enter
    const handleSearchKeyDown = async (e) => {
        if (e.key === 'Enter' && isAiMode && searchQuery.trim() !== '') {
            e.preventDefault();
            const topic = searchQuery.trim();
            setSearchQuery("");
            setIsCreatingNote(true);

            const NOTE_PATTERNS = [
                "make a note",
                "make note",
                "create notes",
                "create a notes",
                "generate notes",
                "generate a notes",
                "study notes",
                "study a notes",
                "revision notes",
                "revision a notes",
                "notes on",
                "notes on a",
                "prepare notes",
                "prepare a notes"
            ];

            const isNoteRequest = NOTE_PATTERNS.some(pattern =>
                topic.toLowerCase().includes(pattern)
            );

            const intent = isNoteRequest ? "NOTE" : "ARTICLE";

            try {
                const prompt = `Document Intent: ${intent}
                
                You MUST write an EXTREMELY DETAILED, IN-DEPTH, AND COMPREHENSIVE document. Do NOT give brief summaries or short sentences. Write extensively about every aspect of the topic.
                
                Adapt the structure dynamically to the subject instead of using a fixed template.
                Choose section headings that naturally fit the topic.

                Examples:
                * Events → Background, Timeline, What Happened, Impact, Current Status
                * People → Overview, Early Life, Career, Achievements, Controversies
                * Technical Topics → Overview, Core Concepts, Architecture, Examples, Best Practices
                * Direct Questions → Answer the question first, then provide supporting details
                * Comparisons → Similarities, Differences, Pros, Cons, Recommendation

                Formatting Requirements (STRICTLY ENFORCED):
                * You MUST use HTML tags. Plain text will be rejected.
                * Every main section heading MUST be wrapped in <h2> tags.
                * Every subsection heading MUST be wrapped in <h3> tags.
                * Use <p> for long, detailed paragraphs.
                * Use <ul>, <ol>, and <li> where lists improve readability.
                * You MUST heavily use <strong> to highlight important concepts, terms, names, or key facts.
                * Do NOT use Markdown formatting (no ** or #).
                * Do NOT force unnecessary sections unless they are genuinely useful.

                Return ONLY a raw valid JSON object with exactly two keys:

                "title": A concise and accurate title.

                "content": Highly detailed HTML formatted content suitable for long-term storage and reading.

                No markdown code blocks (e.g. no \`\`\`json).
                No conversational text.
                No explanations outside JSON.

                User Query:
                ${topic}
                `;

                const DASHBOARD_CREATE_SYSTEM_PROMPT = `You are an expert research, analysis, and knowledge assistant.

Your goal is to transform the user's query into a highly detailed, comprehensive, long-form knowledge document that can be saved, searched, and referenced in the future.

CONTENT QUALITY REQUIREMENTS:

1. Do NOT provide short answers, brief summaries, or shallow overviews.
2. Every major section should contain detailed explanations and meaningful depth.
3. Explain not only WHAT something is, but also WHY it matters, HOW it works, its implications, limitations, and real-world relevance when applicable.
4. Prioritize the most important keywords, entities, and themes found in the user's query.
5. Allocate significantly more content to the primary subject than to secondary subjects.
6. Avoid generic filler content and repetitive statements.
7. Focus on information density, not word count.
8. Use concrete examples whenever they improve understanding.
9. Maintain logical flow between sections.

TOPIC ANALYSIS RULES:

1. First identify the primary subject of the query.
2. Identify supporting or secondary subjects.
3. The primary subject should receive approximately 60-80% of the document's attention.
4. Do not distribute content equally across all mentioned topics.
5. If the query contains years, forecasts, trends, predictions, markets, companies, industries, jobs, salaries, investments, technology adoption, or future outlooks:

   * Include relevant statistics when available.
   * Include projections and forecasts.
   * Include trend analysis.
   * Include market implications.
   * Include industry-specific insights.
   * Include practical examples.
   * Include future opportunities and risks.

STRUCTURE RULES:

1. Organize information using a logical hierarchy.
2. Use semantic HTML only.
3. Use <h2> for major sections.
4. Use <h3> for subsections.
5. Use <p> for detailed explanations.
6. Use <ul>, <ol>, and <li> when lists improve readability.
7. Use <strong> to highlight important concepts, terminology, names, statistics, facts, and conclusions.
8. Avoid unnecessary sections that do not contribute meaningful information.

FORMATTING RULES:

1. Never use Markdown.
2. Never use code fences.
3. Never include conversational text.
4. Never explain what you are doing.
5. Never include text outside the required JSON object.

OUTPUT REQUIREMENTS:

Return ONLY a RAW, VALID JSON object with exactly the following structure:

{
"title": "A concise and accurate title",
"content": "The complete HTML formatted document"
}

The JSON must be valid and parseable.

Do NOT wrap the JSON in markdown blocks.

Return ONLY the JSON object.


`;

                // Enforce JSON Mode (fourth parameter set to true)
                const responseText = await sendMessageToAI(prompt, [], null, true, DASHBOARD_CREATE_SYSTEM_PROMPT);
                // console.log(responseText)
                // Extract the JSON object using regex to ignore any surrounding text or tags
                let parsedData = null;
                const jsonMatch = responseText.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    const rawJsonStr = jsonMatch[0];
                    const sanitizedJsonStr = sanitizeJsonString(rawJsonStr);
                    try {
                        parsedData = JSON.parse(sanitizedJsonStr);
                    } catch (parseError) {
                        console.warn("JSON.parse failed, falling back to regex extraction:", parseError);
                    }
                }

                // Fallback to regex extraction if JSON parsing failed or object is empty
                if (!parsedData || !parsedData.content) {
                    console.log("Using regex fallback to extract content and title.");
                    const extractedContent = extractStreamedContent(responseText);
                    const extractedTitle = extractStreamedTitle(responseText) || topic;
                    if (extractedContent) {
                        parsedData = {
                            title: extractedTitle,
                            content: extractedContent
                        };
                    }
                }

                if (!parsedData || !parsedData.content) {
                    throw new Error("No valid content found in the AI response.");
                }

                if (parsedData.title && parsedData.content) {
                    const userId = userData?.userdetaild?.userId ||
                        userData?.userdetaild?.$id ||
                        userData?.userId ||
                        userData?.$id ||
                        "anonymous";

                    const cleanTitle = parsedData.title.trim().replace(/\s+/g, " ");
                    const generatedSlug = cleanTitle.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "");

                    const newNoteResponse = await service.createNote({
                        Notes_title: parsedData.title,
                        slug: generatedSlug,
                        Notes_contents: parsedData.content,
                        notes_images: [],
                        Is_note_important: false,
                        User_Unique_ID: userId,
                    });

                    if (newNoteResponse && newNoteResponse.$id) {
                        dispatch(addNoteToTop(newNoteResponse));
                        showToast("ai_success", "Note created");
                    }
                }
            } catch (error) {
             handleError(error, { action: "generating AI note" });
            } finally {
                setIsCreatingNote(false);
            }
        }
    };

    return (


        <div className="flex w-full h-screen bg-background overflow-hidden font-sans text-foreground relative ashwin">

            {/* Sidebar Component */}
            <SideNavBar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
            {/* Main Content Area */}
            <div className="flex-1 relative overflow-hidden flex flex-col">

                {/* Dashboard Main View */}
                <main className={`absolute inset-0 flex flex-col`}>

                    {/* Header with Search */}
                    <header className="flex items-center gap-4 sticky top-0 bg-background/90 backdrop-blur-md z-10 px-4 md:px-8 py-5 border-b border-border">

                        {/* Hamburger Menu for Mobile */}
                        <button
                            type="button"
                            className="md:hidden text-foreground/80 hover:text-foreground"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <List size={28} />
                        </button>

                        <div className="relative flex items-center flex-1 md:flex-none">
                            {/* Sliding Text Animation */}
                            <div
                                className={`hidden md:block absolute left-full ml-4 whitespace-nowrap text-sm font-semibold transition-all duration-500 ease-out z-0
                                    ${showSlideText ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}
                                    ${isAiMode ? 'text-purple-400' : 'text-muted-foreground'}
                                `}
                            >
                                {slideText}
                            </div>

                            {/* Responsive Search Bar */}
                            <div className="relative flex items-center h-11 w-full md:w-[28rem] rounded-xl bg-card border border-border focus-within:border-[#8b5cf6] transition-colors z-10 shadow-lg">
                                <div className="pl-4 pr-2 flex items-center pointer-events-none">
                                    <MagnifyingGlass className="h-5 w-5 text-muted-foreground" />
                                </div>
                                <input
                                    type="text"
                                    className="w-full h-full bg-transparent text-foreground text-sm focus:outline-none placeholder:text-muted-foreground/50 placeholder:transition-all"
                                    placeholder={isAiMode ? "give topic & make note automatically" : "Search or ask your notes..."}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearchKeyDown}
                                />
                                <div className="pr-4 pl-2 flex items-center gap-3">
                                    <Sparkle weight="fill" className={`size-4 transition-colors ${isAiMode ? 'text-[#8b5cf6]' : 'text-muted-foreground/50'}`} />
                                    {/* Toggle Switch */}
                                    <button
                                        type="button"
                                        onClick={handleToggleAiMode}
                                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isAiMode ? 'bg-[#8b5cf6]' : 'bg-muted'}`}
                                    >
                                        {/* <span className="sr-only">Toggle AI Mode</span> */}
                                        <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isAiMode ? 'translate-x-4' : 'translate-x-0'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        <Outlet context={{
                            searchQuery: isAiMode ? "" : debouncedSearchQuery,
                            isCreatingNote: isCreatingNote
                        }} />
                    </div>

                    {/* Floating Statistics Widget (Hidden on small screens to save space) */}
                    <div className="hidden md:block">
                        <NoteStatistics />
                    </div>
                </main>

                {/* Settings View */}
                {/* <div className={`absolute inset-0 bg-[#0a0a0a] overflow-y-auto transition-transform duration-[600ms] ease-in-out z-20 ${settingState ? 'translate-x-0' : 'translate-x-full'}`}>
                  <Appsetting />
                </div> */}
            </div>
        </div>
    );
}
