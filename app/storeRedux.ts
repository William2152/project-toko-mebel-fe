import { configureStore } from "@reduxjs/toolkit";
import localStorageReducer from "./localStorageSlice";

export const storeRedux = configureStore({
  reducer: {
    localStorage: localStorageReducer,
  },
});

export type RootState = ReturnType<typeof storeRedux.getState>;
export type AppDispatch = typeof storeRedux.dispatch;
