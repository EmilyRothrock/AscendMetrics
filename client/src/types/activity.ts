import { DateTime } from 'luxon';

export interface Activity {
    id: number;
    name: string;
    startTime: string; // ISO format
    endTime: string; // ISO format
    notes: string;
    intensities: {
      fingers: number;
      upperBody: number;
      lowerBody: number;
    };
  }

export const getActivityDuration = (activity: Activity): number => {
    // Calculate the duration in minutes
    const duration = DateTime.fromISO(activity.endTime).diff(DateTime.fromISO(activity.startTime), 'minutes').minutes;
    
    // Handle cases where end time might be after midnight (if applicable)
    return duration < 0 ? 1440 + duration : duration; // 1440 minutes in a day
};