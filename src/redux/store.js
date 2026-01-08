import { configureStore } from '@reduxjs/toolkit'
import TogglesStatesReducer from './QuickChatAI/QuickChatAiSlice.js'
import NotesCreationReducer from './NotesCreation/NotesCreationSlice.js'
import userauthanticationReducer from './Authantication/UserAuthanticationSlice.js'
export default configureStore({
    reducer: {
        ToggleStates: TogglesStatesReducer,
        NotesCreation: NotesCreationReducer,
        UserAuthantication: userauthanticationReducer
    }
})