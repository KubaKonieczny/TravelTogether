import { createSlice } from "@reduxjs/toolkit";
import {reducer} from "next/dist/client/components/router-reducer/router-reducer";

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
}
const initialState = {
    isAuthenticated: false,
    isLoading: true,
} as AuthState;

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: state => {
            state.isAuthenticated = true;
        },
        logout: state => {
            state.isAuthenticated = false;
        },
        finishInitialLoad: state => {
            state.isLoading = false;
        }

    }
})

export const {setAuth,logout,finishInitialLoad  } = authSlice.actions
export default authSlice.reducer;

