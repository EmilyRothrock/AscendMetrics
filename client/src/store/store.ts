import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import sessionMetricsReducer from "./sessionMetricsSlice";

const rootReducer = combineReducers({
  sessionMetrics: sessionMetricsReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
