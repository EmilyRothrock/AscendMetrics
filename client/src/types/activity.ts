import { Intensity } from './intensity';

export interface Activity {
    name: string;
    startTime: string; // Consider ISO 8601 format
    endTime: string; // Consider ISO 8601 format
    notes: string;
    intensities: Intensity[];
}
