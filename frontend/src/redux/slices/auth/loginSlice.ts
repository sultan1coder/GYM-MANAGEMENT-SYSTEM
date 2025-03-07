import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ILoginBody, IloginResponse } from "../../../types/login";
import { data } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../../constants";

const initialState = {
    loading: false,
    data: {} as IloginResponse,
    error: ""
}

export const loginFn = createAsyncThunk("auth/login", async (data: ILoginBody, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/auth/login`);
    } catch (error) {
        if (error instanceof AxiosError) {
            return rejectWithValue(error.response?.data.messaga || DEFAULT_ERROR_MESSAGE);
        }

        return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
})

export const loginSlice = createSlice({
    name: "login slice",
    initialState,
    reducers: {},
    extraReducers(builder) { }
});