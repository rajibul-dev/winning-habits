import { configureStore } from "@reduxjs/toolkit";
import guideReducer from "./features/app-guide/guideSlice";

export default configureStore({
  reducer: {
    guide: guideReducer,
  },
});
