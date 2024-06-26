import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import sessionsReducer from './sessionsSlice.ts';
import metricsReducer from './metricsSlice.ts';

const rootReducer = combineReducers({
  sessions: sessionsReducer,
  metrics: metricsReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export default store;
