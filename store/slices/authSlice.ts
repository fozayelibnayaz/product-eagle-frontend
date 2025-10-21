import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  user: null as null | { username: string }
};

const slice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<{ username: string } | null>) {
      state.user = action.payload;
    }
  }
});

export const { setUser } = slice.actions;
export default slice.reducer;
