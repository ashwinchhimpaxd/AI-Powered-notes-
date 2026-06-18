import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    Islogin: false,
    UserData: null
}
const userauthantication = createSlice({

    name: "UserAuth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.Islogin = true;
            state.UserData = action.payload.UserData;
        },
        logout: (state) => {
            state.Islogin = false;
            state.UserData = null;
        },
        updateusername: (state, action) => {
            state.UserData.userdetaild = action.payload;
        }
    }
})

export const { login, logout, updateusername } = userauthantication.actions;

export default userauthantication.reducer;