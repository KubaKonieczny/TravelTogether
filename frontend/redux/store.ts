import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";
import {apiSlice} from "./services/apiSlice";
import authSlice from "./features/authSlice";

export const makeStore = () =>
    configureStore({
        reducer: {
            [apiSlice.reducerPath]: apiSlice.reducer,
            auth: authReducer
        },
        middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware),
        devTools: process.env.NODE_ENV !== "production",
    })

export type AppState = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppState['getState']>;
export type AppDispatch = AppState['dispatch'];