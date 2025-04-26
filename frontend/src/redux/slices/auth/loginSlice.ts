import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ILoginBody, IloginResponse } from "../../../types/users/login";
import axios, { AxiosError } from "axios";
import { BASE_API_URL, DEFAULT_ERROR_MESSAGE } from "../../../constants";

const DEFAULT_USER_DATA = localStorage.getItem("userData")
  ? JSON.parse(localStorage.getItem("userData")!)
  : {};

const initialState = {
  loading: false,
  data: (DEFAULT_USER_DATA as IloginResponse) || ({} as IloginResponse),
  error: "",
};

export const loginFn = createAsyncThunk(
  "users/login",
  async (data: ILoginBody, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/users/login`, data);
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

export const loginSlice = createSlice({
  name: "login slice",
  initialState,
  reducers: {
    logout: (state) => {
      state.data = {} as IloginResponse;
      state.error = "";
      state.loading = false;

      // Remove the data from the local storage
      localStorage.removeItem("userData");
    },
  },

  extraReducers(builder) {
    //Pending..
    builder.addCase(loginFn.pending, (state) => {
      state.loading = true;
      state.error = "";
      state.data = {} as IloginResponse;
    });

    //Fulfilled
    builder.addCase(loginFn.fulfilled, (state, action) => {
      state.loading = false;
      state.error = "";
      state.data = action.payload;
    });

    //Rejected
    builder.addCase(loginFn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      state.data = {} as IloginResponse;
    });
  },
});

export const { logout } = loginSlice.actions;
