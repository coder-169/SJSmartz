"use client";

import { createSlice } from "@reduxjs/toolkit";

export interface CounterState {
  noOfProducts: number;
  list: Array<object>[];
  loading: boolean;
}

const initialState: CounterState = {
  noOfProducts: 0,
  list: [],
  loading: true,
};

export const counterSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    loadProducts: (state, action) => {
      state.list = action.payload.products;
      state.noOfProducts = action.payload.noOfProducts;
      state.loading = false;
    },
  },
});
export const { loadProducts } = counterSlice.actions;
export default counterSlice.reducer;
