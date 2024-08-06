import { DateTime } from "luxon";
import { BodyPartMetrics, Session } from "../types";
import { SessionsState } from "../types/sessionState";
import { FieldName } from "../types/fieldOptions";
import { FilterValueType } from "../types/filterValueType";
import { compareDates, fieldComparer } from "./comparisons";
import { fieldFilterer } from "./filters";

export function updateSessionCalculations(session: Session) {
  const results = session.activities.reduce((accumulator, activity) => {
    const activityDurationInHours = calculateDurationInHours(activity.startTime, activity.endTime);
    const activityLoads = calculateLoads(activityDurationInHours, activity.intensities);

    activity.duration = activityDurationInHours * 60;
    activity.loads = activityLoads;

    return {
      duration: accumulator.duration + activityDurationInHours,
      loads: {
        fingers: accumulator.loads.fingers + activityLoads.fingers,
        upperBody: accumulator.loads.upperBody + activityLoads.upperBody,
        lowerBody: accumulator.loads.lowerBody + activityLoads.lowerBody
      }
    };
  }, { duration: 0, loads: { fingers: 0, upperBody: 0, lowerBody: 0 } });

  session.duration = results.duration;
  session.loads = results.loads;

  return session;
}

export function calculateDurationInHours(startTime: string, endTime: string): number {
    const start = DateTime.fromISO(startTime);
    const end = DateTime.fromISO(endTime);
    return end.diff(start, 'hours').hours;
}

export function calculateLoads(durationInHours: number, intensities: BodyPartMetrics): BodyPartMetrics {
    return {
      fingers: intensities.fingers * durationInHours,
      upperBody: intensities.upperBody * durationInHours,
      lowerBody: intensities.lowerBody * durationInHours,
    }
}

export function insertSessionId(state: SessionsState, newSession: Session): null {
  const index = findIndexByDate(state, newSession.completedOn);
    if (state.sessionIds[index] !== newSession.id) {
      state.sessionIds.splice(index, 0, newSession.id);
    }
    return null;
}

export const findIndexByDate = (state: SessionsState, targetDate: string) => {
  const array = state.sessionIds;
  let low = 0, high = array.length - 1;
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
export function updateSessionsState(state: SessionsState, newSessions: Session[]): void {
  const sessionIdsSet = new Set(state.sessionIds);

  newSessions.forEach((session: Session) => {
    state.sessions[session.id] = session;
    sessionIdsSet.add(session.id);
  });

  state.sessionIds = Array.from(sessionIdsSet);
  // TODO: custom sort which removes dupes for lower run time?
  state.sessionIds.sort((a, b) => compareDates(state.sessions[a].completedOn, state.sessions[b].completedOn));
}



export function sortSessions(sessionIds: number[], sessions: Record<number, Session>, selectedField: FieldName | null = 'completedOn', sortAscending: boolean = true): number[] {
  // init sorted ids array
  if (selectedField && sessions && sessionIds && selectedField !== 'activities') {
    const sortedSessionIds = sessionIds.slice();
    const comparisonFunction = fieldComparer(selectedField);
    sortedSessionIds.sort((a, b) => 
      comparisonFunction(
        sessions[a][selectedField],
        sessions[b][selectedField],
        sortAscending
      )
    );
    return sortedSessionIds;
  } else return sessionIds;
}

export function filterSessions(sessionIds: number[], sessions: Record<number, Session>, selectedField: FieldName | null, filterValue: FilterValueType): number[] {
  if (selectedField && sessions && sessionIds) {
    const filterFunction = fieldFilterer(selectedField);
    const filteredSessionIds = sessionIds.filter((id) => filterFunction(sessions[id][selectedField], filterValue));
    return filteredSessionIds;
  } else return sessionIds;
}