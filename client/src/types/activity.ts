import { Intensity } from './intensity';
import { DateTime } from 'luxon';

export interface Activity {
    name: string;
    startTime: string; // e.g., '7:00PM'
    endTime: string; // e.g., '8:00PM'
    notes: string;
    intensities: Intensity[];
}

export const getActivityDuration = (activity: Activity): number => {
    const start = DateTime.fromFormat(activity.startTime, 'h:mma');
    const end = DateTime.fromFormat(activity.endTime, 'h:mma');

    // Calculate the duration in minutes
    const duration = end.diff(start, 'minutes').minutes;
    
    // Handle cases where end time might be after midnight
    return duration < 0 ? 1440 + duration : duration; // 1440 minutes in a day
};
