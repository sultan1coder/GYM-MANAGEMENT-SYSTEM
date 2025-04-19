import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "./slices/auth/loginSlice";
import { registerSlice } from "./slices/auth/registerSlice";

export const store = configureStore({
  reducer: {
    loginSlice: loginSlice.reducer,
    registerSlice: registerSlice.reducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
