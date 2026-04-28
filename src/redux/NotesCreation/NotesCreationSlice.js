import { createSlice } from '@reduxjs/toolkit'

const NotesCreation = createSlice({
    name: 'NotesCreation',
    initialState: {
        notes: []
    },
    reducers: {
        
        // addNote: (state, action) => {
        //     const newNote = {
        //         $id: `temp_${Date.now()}`,
        //         title: action.payload || "Untitled Note",
        //         description: "Your note description will appear here.",
        //         $updatedAt: new Date().toISOString(),
        //     };
        //     state.notes.unshift(newNote); // Add to the top of the array
        // },
        deleteNote: (state, action) => {
            state.notes = state.notes.filter(note => note.$id !== action.payload);
        },
        setNotes: (state, action) => {
            state.notes = action.payload;
        },
        appendNotes: (state, action) => {
            state.notes = [...state.notes, ...action.payload];
        },
        addNoteToTop: (state, action) => {
            const exists = state.notes.find(n => n.$id === action.payload.$id);
            if (!exists) {
                state.notes.unshift(action.payload);
            }
        },
        updateNoteInSlice: (state, action) => {
            const index = state.notes.findIndex(note => note.$id === action.payload.$id);
            if (index !== -1) {
                state.notes.splice(index, 1);
            }
            state.notes.unshift(action.payload);
        }
    }
})

// Action creators are generated for each case reducer function
export const { Notetitlesetter, NoteSlugsetter, addNote, deleteNote, setNotes, appendNotes, addNoteToTop, updateNoteInSlice } = NotesCreation.actions

export default NotesCreation.reducer