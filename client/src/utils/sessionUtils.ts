import { DateTime } from "luxon";
import { BodyPartMetrics, TrainingSession } from "@shared/types";
import { FieldName } from "../types/fieldOptions";
import { FilterValueType } from "../types/filterValueType";
import { fieldComparer } from "./comparisons";
import { fieldFilterer } from "./filters";

export function updateSessionCalculations(trainingSession: TrainingSession) {
  const results = trainingSession.sessionActivities.reduce(
    (accumulator, activity) => {
      const activityDurationInHours = calculateDurationInHours(
        activity.startTime,
        activity.endTime
      );
      const activityLoads = calculateLoads(
        activityDurationInHours,
        activity.intensities
      );

      activity.duration = activityDurationInHours * 60;
      activity.loads = activityLoads;

      return {
        duration: accumulator.duration + activityDurationInHours,
        loads: {
          fingers: accumulator.loads.fingers + activityLoads.fingers,
          upperBody: accumulator.loads.upperBody + activityLoads.upperBody,
          lowerBody: accumulator.loads.lowerBody + activityLoads.lowerBody,
        },
      };
    },
    { duration: 0, loads: { fingers: 0, upperBody: 0, lowerBody: 0 } }
  );

  trainingSession.duration = results.duration;
  trainingSession.loads = results.loads;

  return trainingSession;
}

export function calculateDurationInHours(
  startTime: string,
  endTime: string
): number {
  const start = DateTime.fromISO(startTime);
  const end = DateTime.fromISO(endTime);
  return end.diff(start, "hours").hours;
}

export function calculateLoads(
  durationInHours: number,
  intensities: BodyPartMetrics
): BodyPartMetrics {
  return {
    fingers: intensities.fingers * durationInHours,
    upperBody: intensities.upperBody * durationInHours,
    lowerBody: intensities.lowerBody * durationInHours,
  };
}

export function sortSessions(
  sessionIds: number[],
  sessions: Record<number, TrainingSession>,
  selectedField: FieldName | null = "completedOn",
  sortAscending: boolean = true
): number[] {
  if (
    selectedField &&
    sessions &&
    sessionIds &&
    selectedField !== "activities"
  ) {
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

export function filterSessions(
  sessionIds: number[],
  sessions: Record<number, TrainingSession>,
  selectedField: FieldName | null,
  filterValue: FilterValueType
): number[] {
  if (selectedField && sessions && sessionIds) {
    const filterFunction = fieldFilterer(selectedField);
    const filteredSessionIds = sessionIds.filter((id) =>
      filterFunction(sessions[id][selectedField], filterValue)
    );
    return filteredSessionIds;
  } else return sessionIds;
}
