import { configureStore } from '@reduxjs/toolkit'
import QuickChatAIReducer from './QuickChatAI/QuickChatAiSlice.js'
export default configureStore({
    reducer: {
        QuickChatAI: QuickChatAIReducer
    }
})