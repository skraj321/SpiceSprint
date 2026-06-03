import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import adminSlice from "./adminSlice";
import mapSlice from "./mapSlice";
export const store = configureStore({
  reducer: {
    user: userSlice,
    admin: adminSlice,
    map: mapSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
