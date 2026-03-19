import { createSlice } from "@reduxjs/toolkit";

const currentnoteinfoslice = createSlice({
    name: "currentnoteinfoslice",
    initialState: {
        noteid: null,
        currentnoteinfo: {
            title: null,
            slug: null,
            content: null,
            images: [],
            isimportant: false,
        }
    },
    reducers: {
        setcurrentnoteinfo: (state, action) => {
            state.currentnoteinfo = action.payload
        },
        setnoteid: (state, action) => {
            state.noteid = action.payload
        },
        resetcurrentnoteinfo: (state) => {
            state.currentnoteinfo = {
                title: null,
                slug: null,
                content: null,
                images: [],
                isimportant: false,
            }
            state.noteid = null
        }
    }
})

export const { setcurrentnoteinfo, setnoteid, resetcurrentnoteinfo } = currentnoteinfoslice.actions
export default currentnoteinfoslice.reducer
