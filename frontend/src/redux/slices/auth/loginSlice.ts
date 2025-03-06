import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ILoginBody, IloginResponse } from "../../../types/login";
import { data } from "react-router-dom";

const initialState = {
    loading: false,
    data: {} as IloginResponse,
    error: ""
}

export const loginFn = createAsyncThunk("auth/login", async (data: ILoginBody, { rejectWithValue }) => {
    try {
        
    } catch (error) {

    }
})

export const loginSlice = createSlice({
    name: "login slice",
    initialState,
    reducers: {},
    extraReducers(builder) { }
});