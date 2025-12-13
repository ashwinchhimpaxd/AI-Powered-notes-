import { createSlice } from '@reduxjs/toolkit'

export const QuickChatAI = createSlice({
    name: 'QuickChatAI',
    initialState: {
        quickchataiState: false
    },
    reducers: {
        QuickChatAIOpen: state => {
            state.quickchataiState = !state.quickchataiState
        },
    }
})

// Action creators are generated for each case reducer function
export const { QuickChatAIOpen } = QuickChatAI.actions

export default QuickChatAI.reducer