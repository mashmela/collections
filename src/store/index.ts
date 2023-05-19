import { configureStore } from "@reduxjs/toolkit";

import modalReducer, { modalSlice } from "./modalSlice";
import profileReducer, { profileSlice } from "./profileSlice";
import userReducer, { userSlice } from "./userSlice";

export const store = configureStore({
  reducer: {
    [modalSlice.name]: modalReducer,
    [profileSlice.name]: profileReducer,
    [userSlice.name]: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
