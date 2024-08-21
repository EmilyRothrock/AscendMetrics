import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { getMetricsWithSessionsForDateRange } from "../services/metricsService";
import { RootState } from "./store";
import axios from "axios";
import { MetricsState } from "../types/metricsState";
import { updateLoadedRange, updateMetricsTable } from "../utils/metricUtils";

const initialState: MetricsState = {
  metricsTable: {},
  loadedRange: null,
  loading: false,
  error: null,
};

/* Selectors Definitions */

export const selectMetricsByDate = createSelector(
  (state: RootState) => state.metrics.metricsTable,
  (_: RootState, date: string) => date,
  (metricsTable, date) => metricsTable[date] || null
);

/* Thunks Definions */

export const fetchMetricsWithSessionsForDateRange = createAsyncThunk(
  "metrics/fetchMetricsWithSessionByDateRange",
  async (
    dateRange: { startDate: string; endDate: string },
    { rejectWithValue }
  ) => {
    try {
      return await getMetricsWithSessionsForDateRange(
        dateRange.startDate,
        dateRange.endDate
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue({
          message: error.message,
          status: error.response?.status,
        });
      } else {
        return rejectWithValue({
          message: "An unknown error occurred",
        });
      }
    }
  }
);

/* Slice Definition */
const metricsSlice = createSlice({
  name: "metrics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMetricsWithSessionsForDateRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMetricsWithSessionsForDateRange.fulfilled,
        (state, action) => {
          const newMetricsTable = action.payload.metricsTable;
          console.log(newMetricsTable);
          state.metricsTable = updateMetricsTable(
            state.metricsTable,
            newMetricsTable
          );
          const newRange = action.meta.arg;
          state.loadedRange = updateLoadedRange(state.loadedRange, newRange);
        }
      )
      .addCase(
        fetchMetricsWithSessionsForDateRange.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error;
        }
      );
  },
});

export default metricsSlice.reducer;
