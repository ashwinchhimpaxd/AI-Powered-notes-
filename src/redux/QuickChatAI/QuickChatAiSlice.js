import { createSlice } from '@reduxjs/toolkit'
const TogglesStates = createSlice({
    name: 'TogglesStates',
    initialState: {
        quickchataiState: false,
        settingState: false,
    },
    reducers: {
        QuickChatAIOpen: state => {
            state.quickchataiState = !state.quickchataiState
        },

        SettingsOpen: state => {
            state.settingState = !state.settingState
        }
    }
})

// Action creators are generated for each case reducer function
export const { QuickChatAIOpen, SettingsOpen } = TogglesStates.actions

export default TogglesStates.reducer
// ai chat box opening state beacuse if i don't use this reducer then pop drilling happen in ai chat box