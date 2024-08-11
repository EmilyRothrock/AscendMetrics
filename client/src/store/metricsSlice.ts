import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { DailyMetrics, MetricsTable } from '../types';  // Ensure this interface is defined correctly
import { getMetricsWithSessionsForDateRange } from '../services/metricsService';
import { DateTime, Interval } from 'luxon';
import { RootState } from './store';
import axios from 'axios';
import { MetricsState } from '../types/metricsState';
import { updateLoadedRange, updateMetricsTable,  } from '../utils/metricUtils';

const initialState: MetricsState = {
  metricsTable: {},
  loadedRange: null,
  loading: false,
  error: null,
}

/* Selectors Definitions */

export const selectMetricsByDate = createSelector(
  (state: RootState, date: string) => state.metrics.metricsTable[date],
  (metrics: DailyMetrics) => ({ metrics })
);

export const selectMetricsForDateRange = createSelector(
  [
    (state: RootState) => state.metrics.metricsTable,
    (_: RootState, startDate: string) => startDate,
    (_: RootState, endDate: string) => endDate
  ],
  (metricsTable, startDate, endDate) => {
    const start = DateTime.fromISO(startDate);
    const end = DateTime.fromISO(endDate);
    const range = Interval.fromDateTimes(start, end);
    const aggregatedMetrics: MetricsTable = {};

    for (const dt of range.splitBy({ days: 1 })) {
      if (!dt.start || !dt.end) {
        continue;  // Skip this iteration if start or end is somehow null
      }
      const dateKey = dt.start.toISODate();
      aggregatedMetrics[dateKey] = metricsTable[dateKey] || null;
    }

    return aggregatedMetrics;
  }
);

/* Thunks Definions */

export const fetchMetricsWithSessionsForDateRange = createAsyncThunk(
  'metrics/fetchMetricsWithSessionByDateRange',
  async (dateRange: { startDate: string, endDate: string }, { rejectWithValue }) => {
    try {
      return await getMetricsWithSessionsForDateRange(dateRange.startDate, dateRange.endDate);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue({
          message: error.message,
          status: error.response?.status
        });
      } else {
        return rejectWithValue({
          message: 'An unknown error occurred'
        });
      }
    }
  }
);

/* Slice Definition */
const metricsSlice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetricsWithSessionsForDateRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetricsWithSessionsForDateRange.fulfilled, (state, action) => {
        const newMetricsTable = action.payload.metricsTable;
        console.log(newMetricsTable);
        state.metricsTable = updateMetricsTable(state.metricsTable, newMetricsTable);
        const newRange = action.meta.arg;
        state.loadedRange = updateLoadedRange(state.loadedRange, newRange);
      })
      .addCase(fetchMetricsWithSessionsForDateRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });
  },
});

export default metricsSlice.reducer;
