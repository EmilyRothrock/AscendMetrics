import { Intensity } from './intensity';
import { DateTime } from 'luxon';

export interface Activity {
    name: string;
    startTime: DateTime; // e.g., DateTime object
    endTime: DateTime; // e.g., DateTime object
    notes?: string;
    intensities: Intensity[];
}

export const getActivityDuration = (activity: Activity): number => {
    const { startTime, endTime } = activity;

    // Calculate the duration in minutes
    const duration = endTime.diff(startTime, 'minutes').minutes;
    
    // Handle cases where end time might be after midnight (if applicable)
    return duration < 0 ? 1440 + duration : duration; // 1440 minutes in a day
};
``
