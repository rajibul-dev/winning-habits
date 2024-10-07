import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showingMainAppGuide: false,
};

const guideSlice = createSlice({
  name: "guide",
  initialState,
  reducers: {
    toggleMainGuide(state, action) {
      state.showingMainAppGuide = !state.showingMainAppGuide;
    },
  },
});

export const { toggleMainGuide } = guideSlice.actions;

export default guideSlice.reducer;

export const getIsShowingMainAppGuide = (state) =>
  state.guide.showingMainAppGuide;
