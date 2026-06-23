import { createSlice } from "@reduxjs/toolkit"


const initialState = {
    SavingNoteTimer: 5000, // default 1 seconds
    nameoftime: "ashwin"
}

const WebSettingConfigSlice = createSlice({
    name: "WebSettingConfig",
    initialState,
    reducers: {
        setSavingNoteTimer: (state, action) => {
            state.SavingNoteTimer = action.payload;
        }
    }
})

export const { setSavingNoteTimer } = WebSettingConfigSlice.actions
export default WebSettingConfigSlice.reducer