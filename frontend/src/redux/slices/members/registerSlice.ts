import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../../constants";
import {
  IRegisterMemberBody,
  IRegisterMemberResponse,
} from "@/types/members/memberRegister";

const initialState = {
  loading: false,
  data: {} as IRegisterMemberResponse,
  error: "",
};

export const registerMemberFn = createAsyncThunk(
  "members/register",
  async (data: IRegisterMemberBody, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/members/register`,
        data
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        return rejectWithValue(
          error.response?.data.messaga || DEFAULT_ERROR_MESSAGE
        );
      }

      return rejectWithValue(DEFAULT_ERROR_MESSAGE);
    }
  }
);

export const registerMemberSlice = createSlice({
  name: "register slice",
  initialState,
  reducers: {},
  extraReducers(builder) {
    //Pending..
    builder.addCase(registerMemberFn.pending, (state) => {
      state.loading = true;
      state.error = "";
      state.data = {} as IRegisterMemberResponse;
    });

    //Fulfilled
    builder.addCase(registerMemberFn.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.data = action.payload;
    });

    //Rejected
    builder.addCase(registerMemberFn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.data = {} as IRegisterMemberResponse;
    });
  },
});
