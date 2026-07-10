import { useReducer, useState, useEffect } from "react";
import SideNavBar from "../Component/DashBoardComps/Navbar";
import { useDispatch } from "react-redux";
import { resetcurrentnoteinfo } from "../redux/currentnoteinfoslice/currentnoteinfoslice";
import { List } from "@phosphor-icons/react";
import { Outlet } from "react-router-dom";
import SearchBarAndAutoNotes from "../Component/DashBoardComps/SearchBarAndAutoNotes";

export default function Dashboard2() {
    const dispatch = useDispatch();
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    const initialUIState = {
        isMobileMenuOpen: false,
        isCreatingNote: false,
    };

    function uiReducer(state, action) {
        switch (action.type) {
            case "SET_MOBILE_MENU":
                return { ...state, isMobileMenuOpen: action.payload };
            case "SET_CREATING_NOTE":
                return { ...state, isCreatingNote: action.payload };
            default:
                return state;
        }
    }

    const [uiState, uiDispatch] = useReducer(uiReducer, initialUIState);
    const { isMobileMenuOpen, isCreatingNote } = uiState;

    // this is to reset the current note info when the component is mounted
    useEffect(() => {
        dispatch(resetcurrentnoteinfo());
    }, [dispatch]);

    return (
        <div className="flex w-full h-screen bg-background overflow-hidden font-sans text-foreground relative ashwin">

            {/* Sidebar Component */}
            <SideNavBar isOpen={isMobileMenuOpen} setIsOpen={(open) => uiDispatch({ type: "SET_MOBILE_MENU", payload: open })} />
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
                            onClick={() => uiDispatch({ type: "SET_MOBILE_MENU", payload: true })}
                        >
                            <List size={28} />
                        </button>

                        <SearchBarAndAutoNotes
                            onSearchChange={setDebouncedSearchQuery}
                            setIsCreatingNote={(val) => uiDispatch({ type: "SET_CREATING_NOTE", payload: val })}
                        />
                    </header>

                    {/* Content Scrollable Area */}
                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        <Outlet context={{
                            searchQuery: debouncedSearchQuery,
                            isCreatingNote: isCreatingNote
                        }} />
                    </div>

                </main>
            </div>
        </div>
    );
}

