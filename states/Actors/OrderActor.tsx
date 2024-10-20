'use client'

import {
  ORDER_REQUESTED,
  ORDER_REQUEST_SUCCESS,
  ORDER_REQUEST_FAIL,
} from "../Constants/Constants";

export const loadOrders =
  (orders: []) => async (dispatch: (action: { type: string; payload: [] }) => {}) => {
    dispatch({ type: ORDER_REQUESTED, payload: orders });
  };
