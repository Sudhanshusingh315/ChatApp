import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { userLogin, userSignup } from "./authslice.api.js";

export const authLogin = createAsyncThunk(
    "auth/login",
    async (data, { rejectWithValue }) => {
        try {
            const response = await userLogin(data);
            return response?.data;
        } catch (err) {
            console.log("login failed", err);
        }
    }
);

export const authSignup = createAsyncThunk(
    "auth/signup",
    async (data, { rejectWithValue }) => {
        try {
            const response = await userSignup(data);
            return response?.data;
        } catch (err) {
            // todo: handle the errors;
            console.log("login failed", err);
        }
    }
);

// todo: logout autslice as well.

const initialState = {
    userInfo: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null,
    userToken: localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null,
    error: null,
    isLoading: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder

            // login
            .addCase(authLogin.fulfilled,  (state, action) => {
                state.userInfo = action?.payload;
                state.userToken = action?.payload?.token;
                if (action?.payload) {
                    localStorage.setItem(
                        "userInfo",
                        JSON.stringify(action?.payload)
                    );
                }
            })
            .addCase(authLogin.pending, (state, action) => {
                console.log("api in transaction");
            })
            .addCase(authLogin.rejected, (satte) => {
                // todo: hadle rejected or errored response;
            })

            // signup

            .addCase(authSignup.fulfilled, (state, action) => {})
            .addCase(authSignup.pending, (state, action) => {})
            .addCase(authSignup.rejected, (state, action) => {});
    },
});

// Action creators are generated for each case reducer function
export const {} = authSlice.actions;

export default authSlice.reducer;
