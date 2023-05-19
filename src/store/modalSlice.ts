import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { UserItemInterface } from "types";

type ItemModalStateInterface =
  | {
      action: "create";
      indexCollection: number;
    }
  | {
      action: "update";
      indexCollection: number;
      indexItem: number;
      item: UserItemInterface;
    };

interface InitialStateInterface {
  itemModalState: ItemModalStateInterface | null;
}

const initialState: InitialStateInterface = {
  itemModalState: null,
};

export const modalSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    setItemModalState: (state, action: PayloadAction<null | ItemModalStateInterface>) => {
      state.itemModalState = action.payload;
    },
  },
});

export const { setItemModalState } = modalSlice.actions;

export default modalSlice.reducer;
