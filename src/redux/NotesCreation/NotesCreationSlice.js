import {
    createSlice,
    createEntityAdapter
} from "@reduxjs/toolkit";

export const notesAdapter = createEntityAdapter({

    selectId: (note) => note.$id,

    sortComparer: (a, b) =>
        new Date(b.$updatedAt) - new Date(a.$updatedAt)
});

const initialState = notesAdapter.getInitialState({

    hasMore: true
});

const NotesCreation = createSlice({

    name: "NotesCreation",

    initialState,

    reducers: {

        setNotes: notesAdapter.setAll,

        appendNotes: notesAdapter.addMany,

        addNoteToTop: notesAdapter.addOne,

        updateNoteInPlace: notesAdapter.upsertOne,

        updateNoteInSlice: notesAdapter.upsertOne,

        deleteNote: notesAdapter.removeOne,

        clearNotes: notesAdapter.removeAll,

        setHasMore: (state, action) => {
            state.hasMore = action.payload;
        }
    }
});

export const {

    setNotes,
    appendNotes,
    addNoteToTop,
    updateNoteInPlace,
    updateNoteInSlice,
    deleteNote,
    clearNotes,
    setHasMore

} = NotesCreation.actions;

export const {
    selectAll: selectAllNotes,
    selectById: selectNoteById,
    selectIds: selectNoteIds
} = notesAdapter.getSelectors((state) => state.NotesCreation);

export default NotesCreation.reducer;