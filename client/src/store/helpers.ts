// Only to be used within slice logic! Modifying the store this way is not allowable outside the internal store logic.
// If it takes the state as an argument - it must be here.

import { DateTime } from "luxon";
import { SessionMetricsState } from "./sessionMetricsSlice";
import { WritableDraft } from "immer";
import { RootState } from "./store";
import {
  getDependencyDateRange,
  updateDependentMetricsForDateRange,
  mergeMetricsTable,
} from "../utils/metricUtils";
import { TrainingSession } from "@shared/types";
import { compareDates } from "../utils/comparisons";

export function updateMetricsTable(
  state: WritableDraft<SessionMetricsState>,
  alteredDate: string
) {
  if (isDateLoaded(state, alteredDate)) {
    const depRange = getDependencyDateRange(alteredDate);
    if (depRange != null && depRange[0] != null && depRange[1] != null) {
      const updatedMetrics = updateDependentMetricsForDateRange(
        depRange as string[],
        state.sessions
      );
      state.metricsTable = mergeMetricsTable(
        state.metricsTable,
        updatedMetrics
      );
    }
  }
}

export function isDateLoaded(
  state: WritableDraft<SessionMetricsState>,
  date: string
): boolean {
  const loadedRange = state.loadedRange;
  if (!loadedRange || !loadedRange.startDate || !loadedRange.endDate) {
    return false;
  }
  const dateLux = DateTime.fromISO(date);
  const rangeStart = DateTime.fromISO(loadedRange.startDate);
  const rangeEnd = DateTime.fromISO(loadedRange.endDate);

  return rangeStart <= dateLux && rangeEnd >= dateLux;
}

export function isRangeLoaded(
  state: RootState,
  startDate: string,
  endDate: string
): boolean {
  const loadedRange = state.sessionMetrics.loadedRange;

  if (!loadedRange || !loadedRange.startDate || !loadedRange.endDate) {
    return false;
  }

  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);
  const rangeStart = DateTime.fromISO(loadedRange.startDate);
  const rangeEnd = DateTime.fromISO(loadedRange.endDate);

  return rangeStart <= start && rangeEnd >= end;
}

export function insertSessionId(
  state: SessionMetricsState,
  newSession: TrainingSession
): null {
  const index = findIndexByDate(state, newSession.completedOn);
  if (state.sessionIds[index] !== newSession.id) {
    state.sessionIds.splice(index, 0, newSession.id);
  }
  return null;
}

export const findIndexByDate = (
  state: SessionMetricsState,
  targetDate: string
) => {
  const array = state.sessionIds;
  let low = 0,
    high = array.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midDate = DateTime.fromISO(state.sessions[array[mid]].completedOn);
    const comparisonDate = DateTime.fromISO(targetDate);

    if (midDate < comparisonDate) {
      high = mid - 1;
    } else if (midDate > comparisonDate) {
      low = mid + 1;
    } else {
      return mid; // Found the exact date
    }
  }
  return low; // Suitable index for the start of the range
};

/**
 * Merges new sessions into the existing state and re-sorts the session IDs.
 * @param state The current state of sessions.
 * @param newSessions New sessions to be added.
 */
export function updateSessionsState(
  state: SessionMetricsState,
  newSessions: TrainingSession[]
): void {
  const sessionIdsSet = new Set(state.sessionIds);

  newSessions.forEach((session: TrainingSession) => {
    state.sessions[session.id] = session;
    sessionIdsSet.add(session.id);
  });

  state.sessionIds = Array.from(sessionIdsSet);
  // TODO: custom sort which removes dupes for lower run time?
  state.sessionIds.sort((a, b) =>
    compareDates(state.sessions[a].completedOn, state.sessions[b].completedOn)
  );
}
