import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    getInitMessagesGroupThunk,
    getInitMessagesThunk,
} from "./messageslice.api";

export const getInitMessages = createAsyncThunk(
    "messages/getInitMessages",
    async (data, { rejectWithValue }) => {
        try {
            console.log("data for get message between two users",data);
            const response = await getInitMessagesThunk(data);
            console.log("respnse data", response?.data);
            return response?.data;
        } catch (err) {
            console.log("unable to get one-on-one chat", err);
        }
    }
);

export const getInitMessagesGroup = createAsyncThunk(
    "messages/getInitMessagesGroup",
    async (data, { rejectWithValue }) => {
        try {
            console.log("init Mesasages data", data);
            const response = await getInitMessagesGroupThunk(data);
            console.log("respnse data", response?.data);
            return response?.data;
        } catch (err) {
            console.log("unbale to get group messages", err);
        }
    }
);

// todo: include recipient information here only.

const initialState = {
    initMessages: [],
    isChatLoading: false,
};

const messageSlice = createSlice({
    name: "messages",
    initialState,
    reducers: {
        clearMessage: (state, action) => {
            state.initMessages = [];
            state.isLoading = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getInitMessages.fulfilled, (state, action) => {
                state.initMessages.push(...action.payload.data);
                state.isChatLoading = false;
                console.log("action payloa", action.payload);
            })
            .addCase(getInitMessages.pending, (state, action) => {
                state.isChatLoading = true;
            })
            // init messages from group.
            .addCase(getInitMessagesGroup.fulfilled, (state, action) => {
                state.initMessages.push(...action.payload.data);
                console.log("action payloat", action.payload);
            });
    },
});

// Action creators are generated for each case reducer function
export const { clearMessage } = messageSlice.actions;

export default messageSlice.reducer;
