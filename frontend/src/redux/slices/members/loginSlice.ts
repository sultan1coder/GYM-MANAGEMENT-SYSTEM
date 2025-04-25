import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../../constants";
import { ILoginMemberBody, ILoginMemberResponse } from "@/types/memberLogin";

const DEFAULT_USER_DATA = localStorage.getItem("memberData")
  ? JSON.parse(localStorage.getItem("memberData")!)
  : {};

const initialState = {
  loading: false,
  data: (DEFAULT_USER_DATA as ILoginMemberResponse) || ({} as ILoginMemberResponse),
  error: "",
};

export const loginMemberFn = createAsyncThunk(
  "members/login",
  async (data: ILoginMemberBody, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/members/login`, data);
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

export const loginMemberSlice = createSlice({
  name: "login member slice",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = {} as ILoginMemberResponse;
      state.error = "";
      state.loading = false;

      // Remove the data from the local storage
      localStorage.removeItem("memberData");
    },
  },

  extraReducers(builder) {
    //Pending..
    builder.addCase(loginMemberFn.pending, (state) => {
      state.loading = true;
      state.error = "";
      state.data = {} as ILoginMemberResponse;
    });

    //Fulfilled
    builder.addCase(loginMemberFn.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.data = action.payload;
    });

    //Rejected
    builder.addCase(loginMemberFn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.data = {} as ILoginMemberResponse;
    });
  },
});

export const { logout } = loginMemberSlice.actions;
