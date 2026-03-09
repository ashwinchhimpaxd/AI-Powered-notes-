import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    Islogin: false,
    UserData: {}
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
        }
    }
})

export const { login, logout } = userauthantication.actions;

export default userauthantication.reducer;