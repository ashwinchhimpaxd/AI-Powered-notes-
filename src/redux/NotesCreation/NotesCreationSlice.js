import { createSlice } from '@reduxjs/toolkit'

const NotesCreation = createSlice({
    name: 'NotesCreation',
    initialState: {
        NoteTitle: false
    },
    reducers: {
        Notetitlesetter: (state, action) => {
            state.NoteTitle = action.payload
        },
    }
})

// Action creators are generated for each case reducer function
export const { Notetitlesetter } = NotesCreation.actions

export default NotesCreation.reducer