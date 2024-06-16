// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import sessionsReducer from './sessionsSlice.ts';
import metricsReducer from './metricsSlice.ts';
import completeDateRangeReducer from './completeDateRangeSlice.ts';

// Define the root reducer by combining various feature reducers
const rootReducer = combineReducers({
  sessions: sessionsReducer,
  metrics: metricsReducer,
  completeDateRange: completeDateRangeReducer
});

// Configure the Redux store
const store = configureStore({
  reducer: rootReducer,
  // Additional middleware can be added here
});

// Types for RootState and AppDispatch
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
