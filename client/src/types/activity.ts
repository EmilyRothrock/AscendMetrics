import { DateTime } from "luxon";
import { BodyPartMetrics, SessionActivity } from "@shared/types";

export const calculateDuration = (
  startTime: string,
  endTime: string
): number => {
  // Calculate the duration in minutes
  const duration = DateTime.fromISO(endTime).diff(
    DateTime.fromISO(startTime),
    "minutes"
  ).minutes;

  // Handle cases where end time might be after midnight (if applicable)
  return duration < 0 ? 1440 + duration : duration; // 1440 minutes in a day
};

export function calculateLoads(
  intensities: BodyPartMetrics,
  duration: number
): BodyPartMetrics {
  // durations are in hours
  return {
    fingers: (intensities.fingers * duration) / 60,
    upperBody: (intensities.upperBody * duration) / 60,
    lowerBody: (intensities.lowerBody * duration) / 60,
  };
}

export function calculateActivityMetrics(
  activity: Omit<SessionActivity, "duration" | "loads" | "strains">
): SessionActivity {
  const duration = calculateDuration(activity.startTime, activity.endTime);
  const loads = calculateLoads(activity.intensities, duration);

  return {
    ...activity,
    duration,
    loads,
  };
}

/**
 * Generates a default activity with initialized values.
 * Useful for creating new activity instances where no initial data is provided.
 * Ensures that each field in an Activity has a safe initial value.
 * @returns {SessionActivity} A new activity object with default values.
 */
export const defaultNewSessionActivity = (): SessionActivity => ({
  id: -Number(DateTime.now()), // A temporary ID that cannot conflict with database-assigned IDs
  name: "", // Default empty name
  startTime: DateTime.now().toFormat("HH:mm"), // Default start time in ISO format
  endTime: DateTime.now().plus({ hour: 1 }).toFormat("HH:mm"), // Default end time in ISO format
  note: "", // Default empty notes
  duration: 0, // Default duration of 0 minutes
  intensities: {
    fingers: 0, // Default intensity for fingers
    upperBody: 0, // Default intensity for the upper body
    lowerBody: 0, // Default intensity for the lower body
  },
  loads: {
    fingers: 0, // Default load for fingers
    upperBody: 0, // Default load for the upper body
    lowerBody: 0, // Default load for the lower body
  },
});
