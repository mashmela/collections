import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserInfoInterface } from "types";

interface InitialStateInterface {
  profile: UserInfoInterface | null;
}

const initialState: InitialStateInterface = { profile: null };

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserInfoInterface | null>) => {
      state.profile = action.payload;
    },
  },
});

export const { setProfile } = profileSlice.actions;

export default profileSlice.reducer;
