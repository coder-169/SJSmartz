"use client";

import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./Reducers/ProductReducer"

export const store = configureStore({
  reducer: {
    products: productReducer,
},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
