import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserInfoInterface } from "types";

interface InitialStateInterface {
  userInfo: null | UserInfoInterface;
}

const initialState: InitialStateInterface = {
  userInfo: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserInfoInterface | null>) => {
      state.userInfo = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export default userSlice.reducer;
