"use client";

import { ORDER_REQUESTED } from "../Constants/Constants";

export const ordersReducer = (
  state = { orders: {}, noOfOrders: 0, loading: false },
  action: { type: string; payload: any },
) => {
  switch (action.type) {
    case ORDER_REQUESTED:
      return {
        ...state,
        noOfOrders: action.payload.noOfOrders,
        orders: action.payload.orders,
        loading: true,
      };
    default:
      return state;
  }
};
