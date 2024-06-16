// src/features/metrics/metricsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MetricsTable } from '../types';  // Ensure this interface is defined correctly

interface MetricsState {
  fingersMetrics: MetricsTable;
  upperBodyMetrics: MetricsTable;
  lowerBodyMetrics: MetricsTable;
}

const initialState: MetricsState = {
  fingersMetrics: {},
  upperBodyMetrics: {},
  lowerBodyMetrics: {},
};

const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    updateFingersMetrics(state, action: PayloadAction<MetricsTable>) {
      state.fingersMetrics = action.payload;
    },
    updateUpperBodyMetrics(state, action: PayloadAction<MetricsTable>) {
      state.upperBodyMetrics = action.payload;
    },
    updateLowerBodyMetrics(state, action: PayloadAction<MetricsTable>) {
      state.lowerBodyMetrics = action.payload;
    },
    updateAllMetrics(state, action: PayloadAction<{ fingers: MetricsTable, upperBody: MetricsTable, lowerBody: MetricsTable }>) {
      const { fingers, upperBody, lowerBody } = action.payload;
      state.fingersMetrics = fingers;
      state.upperBodyMetrics = upperBody;
      state.lowerBodyMetrics = lowerBody;
    },
  },
});

export const { updateFingersMetrics, updateUpperBodyMetrics, updateLowerBodyMetrics, updateAllMetrics } = metricsSlice.actions;
export default metricsSlice.reducer;
