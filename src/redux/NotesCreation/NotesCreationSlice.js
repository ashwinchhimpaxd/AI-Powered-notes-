import { createSlice } from '@reduxjs/toolkit'

const NotesCreation = createSlice({
    name: 'NotesCreation',
    initialState: {
        NoteTitle: null,
        NoteSlug: null,
        notes: [
            {
                $id: "temp1",
                title: "Welcome Note",
                description: "Your notes will appear here once you start writing!",
                $updatedAt: new Date().toISOString(),
            },
            {
                $id: "temp2",
                title: "How to Use",
                description: "Create notes using the editor and they will show up here.",
                $updatedAt: new Date().toISOString(),
            },
            {
                $id: "temp3",
                title: "How to Use this AI powered Notes for better workflow",
                description: "Create notes using the editor and they will show up here.",
                $updatedAt: new Date().toISOString(),
            },
            {
                $id: "temp4",
                title: "Another Note Title",
                description: "This is another description.",
                $updatedAt: new Date().toISOString(),
            },
            {
                $id: "temp5",
                title: "Short Title",
                description: "A short description.",
                $updatedAt: new Date().toISOString(),
            },
        ]
    },
    reducers: {
        Notetitlesetter: (state, action) => {
            state.NoteTitle = action.payload
        },
        NoteSlugsetter: (state, action) => {
            // Only strictly generate the slug once, or allow resetting back to empty
            if (!state.NoteSlug || action.payload === "") {
                state.NoteSlug = action.payload
            }
        },
        addNote: (state, action) => {
            const newNote = {
                $id: `temp_${Date.now()}`,
                title: action.payload || "Untitled Note",
                description: "Your note description will appear here.",
                $updatedAt: new Date().toISOString(),
            };
            state.notes.unshift(newNote); // Add to the top of the array
        },
        deleteNote: (state, action) => {
            state.notes = state.notes.filter(note => note.$id !== action.payload);
        },
        setNotes: (state, action) => {
            state.notes = action.payload;
        }
    }
})

// Action creators are generated for each case reducer function
export const { Notetitlesetter, NoteSlugsetter, addNote, deleteNote, setNotes } = NotesCreation.actions

export default NotesCreation.reducer