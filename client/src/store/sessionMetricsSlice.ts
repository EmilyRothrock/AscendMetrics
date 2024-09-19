import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
  SerializedError,
} from "@reduxjs/toolkit";
import { RootState } from "./store";
import filterObjectByKeys from "../utils/filterObjByKeys";
import { DateTime } from "luxon";
import axios, { AxiosError } from "axios";
import {
  getSessionById,
  getSessionsForDateRange,
} from "../services/sessionService";
import { MetricsTable, TrainingSession } from "@shared/types";
import { DateRange } from "../types/dateRange";
import { getMetricsWithSessionsForDateRange } from "../services/metricsService";
import { compareDates } from "../utils/comparisons";
import { updateSessionCalculations } from "../utils/sessionUtils";
import {
  mergeMetricsTable,
  mergeRanges,
  updateDependentMetricsForDateRange,
} from "../utils/metricUtils";
import {
  insertSessionId,
  updateMetricsTable,
  updateSessionsState,
} from "./helpers";

export interface SessionMetricsState {
  sessions: Record<number, TrainingSession>;
  sessionIds: number[]; // A list of ids sorted by date (newest to oldest)
  metricsTable: MetricsTable;
  loadedRange: DateRange | null;
  loading: boolean;
  error: SerializedError | null;
}

const initialState: SessionMetricsState = {
  sessions: {},
  sessionIds: [],
  metricsTable: {},
  loadedRange: null,
  loading: false,
  error: null,
};

/* Selectors Definitions */
// TODO: validation and graceful error handling

export const selectMetricsByDate = createSelector(
  (state: RootState) => state.sessionMetrics.metricsTable,
  (_: RootState, date: string) => date,
  (metricsTable, date) => metricsTable[date] || null
);

export const selectMetrics = createSelector(
  (state: RootState) => state.sessionMetrics.metricsTable,
  (_: RootState, metrics: string[]) => metrics,
  (metricsTable, metrics) => filterObjectByKeys(metricsTable, metrics) || null
);

export const selectSessionById = createSelector(
  (state: RootState) => state.sessionMetrics.sessions,
  (_: RootState, sessionId: number) => sessionId,
  (sessions, sessionId) => sessions[sessionId] || null
);

export const selectSessionsForDateRange = createSelector(
  (state: RootState) => state.sessionMetrics.sessions,
  (state: RootState) => state.sessionMetrics.sessionIds,
  (
    _: RootState,
    { startDate, endDate }: { startDate: string; endDate: string }
  ) => ({ startDate, endDate }),
  (sessions, sessionIds, { startDate, endDate }) => {
    const start = DateTime.fromISO(startDate);
    const end = DateTime.fromISO(endDate);

    if (!start.isValid || !end.isValid) {
      console.error("Invalid date range");
      return null;
    }

    const relevantSessions = sessionIds
      .map((id) => sessions[id])
      .filter((session) => {
        const sessionDate = DateTime.fromISO(session.completedOn);
        return (
          sessionDate.isValid && sessionDate >= start && sessionDate <= end
        );
      });

    return relevantSessions.length > 0 ? relevantSessions : null;
  }
);

/* Thunks Definions */

/**
 * Fetches a session for a specified id.
 * @param sesssionId Number id of the session to fetch.
 * @return Fetched session with complete stats.
 */
export const fetchSessionById = createAsyncThunk(
  "sessions/fetchSessionById",
  async (sessionId: number, { rejectWithValue }) => {
    try {
      const data = await getSessionById(sessionId);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue({
        message: axiosError.message,
        status: axiosError.response?.status ?? 500,
      });
    }
  }
);

/**
 * Fetches sessions for a specified date range.
 * @param startDate ISO format starting date.
 * @param endDate ISO format ending date.
 * @returns Fetched sessions with complete stats in a list.
 */
export const fetchSessionsForDateRange = createAsyncThunk(
  "sessions/fetchSessionForDateRange",
  async (
    { startDate, endDate }: { startDate: string; endDate: string },
    { rejectWithValue }
  ) => {
    try {
      const data = await getSessionsForDateRange(startDate, endDate);
      return data;
    } catch (error) {
      const axiosError = error as AxiosError;
      return rejectWithValue({
        message: axiosError.message,
        status: axiosError.response?.status ?? 500,
      });
    }
  }
);

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
const sessionMetricsSlice = createSlice({
  name: "sessions",
  initialState,
  reducers: {
    createSession(state, action: PayloadAction<TrainingSession>) {
      const newSession = action.payload;
      const updatedSession = updateSessionCalculations(newSession);
      state.sessions[newSession.id] = updatedSession;
      insertSessionId(state, newSession);
      updateMetricsTable(state, newSession.completedOn);
    },
    updateSession(state, action: PayloadAction<TrainingSession>) {
      const prevDate = state.sessions[action.payload.id]?.completedOn;
      const newDate = action.payload.completedOn;

      if (!prevDate || !newDate) {
        console.error("Cannot update session. One or both dates are invalid.");
        return;
      }

      const updatedSession = updateSessionCalculations(action.payload);
      state.sessions[updatedSession.id] = updatedSession;

      if (prevDate !== newDate) {
        state.sessionIds.sort((a: number, b: number) =>
          compareDates(
            state.sessions[a].completedOn,
            state.sessions[b].completedOn
          )
        );
      }

      const prevDateLux = DateTime.fromISO(prevDate);
      const newDateLux = DateTime.fromISO(newDate);

      if (!prevDateLux.isValid || !newDateLux.isValid) {
        console.error("Invalid date format in session.");
        return;
      }

      if (prevDateLux.diff(newDateLux, "months").months > 2) {
        updateMetricsTable(state, prevDate);
        updateMetricsTable(state, newDate);
      } else {
        const startDate = DateTime.min(prevDateLux, newDateLux);
        const endDate = DateTime.max(prevDateLux, newDateLux).plus({
          months: 2,
        });
        if (startDate.isValid && endDate.isValid) {
          const updatedMetrics = updateDependentMetricsForDateRange(
            [startDate.toISO(), endDate.toISO()],
            state.sessions
          );
          state.metricsTable = mergeMetricsTable(
            state.metricsTable,
            updatedMetrics
          );
        }
      }
    },
    deleteSession(state, action: PayloadAction<number>) {
      const deletedId = action.payload;
      const deletedSession = state.sessions[deletedId];
      delete state.sessions[deletedId];
      state.sessionIds = state.sessionIds.filter((id) => id !== deletedId);
      updateMetricsTable(state, deletedSession.completedOn);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionById.fulfilled, (state, action) => {
        const newSession = action.payload;
        state.sessions[newSession.id] = newSession;
        insertSessionId(state, newSession);
        state.loading = false;
      })
      .addCase(fetchSessionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });

    builder
      .addCase(fetchSessionsForDateRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessionsForDateRange.fulfilled, (state, action) => {
        const sessions = action.payload.sessions;
        updateSessionsState(state, sessions);
        state.loading = false;
      })
      .addCase(fetchSessionsForDateRange.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error;
      });

    builder
      .addCase(fetchMetricsWithSessionsForDateRange.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchMetricsWithSessionsForDateRange.fulfilled,
        (state, action) => {
          const sessions: TrainingSession[] = action.payload.sessions;
          updateSessionsState(state, sessions);

          const newMetricsTable = action.payload.metricsTable;
          const newRange = action.meta.arg;

          state.metricsTable = mergeMetricsTable(
            state.metricsTable,
            newMetricsTable
          );
          state.loadedRange = mergeRanges(state.loadedRange, newRange);
          state.loading = false;
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

export const { createSession, updateSession, deleteSession } =
  sessionMetricsSlice.actions;
export default sessionMetricsSlice.reducer;
