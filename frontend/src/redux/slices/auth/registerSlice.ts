import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IloginResponse, IRegisterUser } from "../../../types/login";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../../constants";

const initialState = {
    loading: false,
    data: {} as IloginResponse,
    error: ""
}

export const registerFn = createAsyncThunk("users/register", async (data: IRegisterUser, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${BASE_API_URL}/users/register`, data);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            return rejectWithValue(error.response?.data.messaga || DEFAULT_ERROR_MESSAGE);
        }

        return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
})

export const registerSlice = createSlice({
    name: "login slice",
    initialState,
    reducers: {},
    extraReducers(builder) {
        //Pending..
        builder.addCase(registerFn.pending, (state) => {
            state.loading = true;
            state.error = "";
            state.data = {} as IRegisterUser;
        });

        //Fulfilled
        builder.addCase(registerFn.fulfilled, (state, action) => {
            state.loading = false;
            state.error = "";
            state.data = action.payload;
        });

        //Rejected
        builder.addCase(registerFn.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            state.data = {} as IRegisterUser;
        });
    }
});