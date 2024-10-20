'use client'

import { createStore, combineReducers, applyMiddleware } from "redux";
import { thunk } from "redux-thunk";

import { composeWithDevTools } from "redux-devtools-extension";

const initialState = {};

const reducer = combineReducers({});

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk)),
);

export default store;
