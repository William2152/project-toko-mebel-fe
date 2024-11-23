import { configureStore } from "@reduxjs/toolkit";
import helperSlice from "./helperSlice";
import { useDispatch } from "react-redux";

export const storeRedux = configureStore({
  reducer: {
    helperSlice: helperSlice,
  },
});

export type RootState = ReturnType<typeof storeRedux.getState>;
export type AppDispatch = typeof storeRedux.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
