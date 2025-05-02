import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "./slices/auth/loginSlice";
import { registerSlice } from "./slices/auth/registerSlice";
import { loginMemberSlice } from "./slices/members/loginSlice";
import { registerMemberSlice } from "./slices/members/registerSlice";

export const store = configureStore({
  reducer: {
    loginSlice: loginSlice.reducer,
    registerSlice: registerSlice.reducer,
    loginMemberSlice: loginMemberSlice.reducer,
    registerMemberSlice: registerMemberSlice.reducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
