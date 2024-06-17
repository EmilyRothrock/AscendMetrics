import { DateTime } from "luxon";
import { Activity, BodyPartMetrics, Session } from "../types";

export function calculateActivityDuration(startTime: string, endTime: string): number {
    // Assuming startTime and endTime are ISO 8601 strings
    const start = DateTime.fromISO(startTime);
    const end = DateTime.fromISO(endTime);
    return end.diff(start, 'hours').hours;
  }
  
export function calculateActivityLoad(activity: Activity): BodyPartMetrics {
    const intensities = activity.intensities;
    const duration = activity.duration;
    return {
      fingers: intensities.fingers * duration,
      upperBody: intensities.upperBody * duration,
      lowerBody: intensities.lowerBody * duration,
    }
}
  
export function updateSessionCalculations(session: Session) {
    session.duration = session.activities.reduce((total, activity) => {
      const activityDuration = calculateActivityDuration(activity.startTime, activity.endTime);
      activity.duration = activityDuration; // Update the activity duration
      return total + activityDuration;
    }, 0);
  
    // loads must be done after durations have been done for activites.
    session.loads = session.activities.reduce((totalLoads, activity) => {
      const activityLoads = calculateActivityLoad(activity);
      totalLoads.fingers += activityLoads.fingers;
      totalLoads.upperBody += activityLoads.upperBody;
      totalLoads.lowerBody += activityLoads.lowerBody;
      return totalLoads;
    }, { fingers: 0, upperBody: 0, lowerBody: 0 });
}