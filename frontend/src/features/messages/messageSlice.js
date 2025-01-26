import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getInitMessagesThunk } from "./messageslice.api";

export const getInitMessages = createAsyncThunk(
    "messages/getInitMessages",
    async (data, { rejectWithValue }) => {
        try {
            const response = await getInitMessagesThunk(data);
            console.log("respnse data", response?.data);
            return response?.data;
        } catch (err) {
            console.log("login failed", err);
        }
    }
);

// todo: include recipient information here only.

const initialState = {
    initMessages:[] ,
    isLoading: false,
};

const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        clearMessage:(state,action)=>{
            state.initMessages = [];
            state.isLoading = true;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getInitMessages.fulfilled, (state, action) => {
            state.initMessages.push(...action.payload.data);
            console.log("action payloa", action.payload);
        });
    },
});

// Action creators are generated for each case reducer function
export const {clearMessage} = messageSlice.actions;

export default messageSlice.reducer;
