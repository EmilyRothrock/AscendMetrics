import { DateTime } from "luxon";
import { Activity, defaultNewActivity } from "./activity";
import { BodyPartMetrics } from "./bodyPartMetrics";

export interface Session {
  id: number;
  completedOn: string; // ISO format
  name?: string;
  note?: string;
  duration: number; // hours
  activities: Activity[];
  loads: BodyPartMetrics;
}

/**
 * Generates a default session with initialized values.
 * Useful for creating new session instances where no initial data is provided.
 * Ensures that each field in a Session has a safe initial value.
 * @returns {Session} A new session object with default values.
 */
export const defaultNewSession = (): Session => ({
  id: -DateTime.now().valueOf(), // A temporary ID that cannot conflict with database given IDs
  completedOn: DateTime.now().toISO(), // Current date and time in ISO format
  name: "", // Default empty name
  note: "", // Default empty notes
  duration: 0, // Default duration of zero
  activities: [defaultNewActivity()], // Empty activities array
  loads: {
    fingers: 0, // Default load for fingers
    upperBody: 0, // Default load for the upper body
    lowerBody: 0, // Default load for the lower body
  },
});

export const generateDisplayName = (
  session: Session,
  maxChars: number
): string => {
  const names = generateActivitiesString(session);

  const cutNames =
    names.length > maxChars ? `${names.substring(0, maxChars)}...` : names;

  return cutNames;
};

export const generateActivitiesString = (session: Session): string => {
  if (!session.activities || session.activities.length === 0) {
    return "Session with no activities"; // Default text when there are no activities
  }

  // Initialize a Set to keep track of unique names
  const uniqueNames = new Set();

  // Iterate over the activities and add unique names to the Set
  session.activities.forEach((activity) => {
    if (activity.name) {
      uniqueNames.add(activity.name);
    }
  });

  // Join unique names into a string separated by commas
  const names = Array.from(uniqueNames).join(", ");

  return names || "Unnamed activities"; // Fallback text if all activities are unnamed
};
