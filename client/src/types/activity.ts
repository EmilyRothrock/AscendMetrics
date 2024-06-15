import { DateTime } from 'luxon';
import { BodyPartMetrics } from './bodyPartMetrics';

export interface Activity {
    id: number;
    name: string;
    startTime: string; // ISO format
    endTime: string; // ISO format
    notes?: string;
    duration: number; // In minutes
    intensities: BodyPartMetrics;
    loads: BodyPartMetrics;
  }

export const calculateDuration = (startTime:string, endTime:string): number => {
    // Calculate the duration in minutes
    const duration = DateTime.fromISO(endTime).diff(DateTime.fromISO(startTime), 'minutes').minutes;
    
    // Handle cases where end time might be after midnight (if applicable)
    return duration < 0 ? 1440 + duration : duration; // 1440 minutes in a day
};

export function calculateLoads(intensities: BodyPartMetrics, duration: number): BodyPartMetrics {
  // durations are in hours
  return {
      fingers: intensities.fingers * duration/60,
      upperBody: intensities.upperBody * duration/60,
      lowerBody: intensities.lowerBody * duration/60
  };
}

export function calculateActivityMetrics(activity: Omit<Activity, 'duration' | 'loads' | 'strains'>): Activity {
  const duration = calculateDuration(activity.startTime, activity.endTime);
  const loads = calculateLoads(activity.intensities, duration);

  return {
      ...activity,
      duration,
      loads,
  };
}