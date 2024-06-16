import { DateTime } from 'luxon';
import { Activity, defaultNewActivity } from './activity';
import { BodyPartMetrics } from './bodyPartMetrics';

export interface Session {
    id: number;
    completedOn: string; // ISO format
    name?: string;
    notes?: string;
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
    id: -Number(DateTime.now()),                 // A temporary ID that cannot conflict with database given IDs
    completedOn: DateTime.now().toISO(),              // Current date and time in ISO format
    name: '',                                  // Default empty name
    notes: '',                                 // Default empty notes
    duration: 0,                               // Default duration of zero
    activities: [defaultNewActivity()],                            // Empty activities array
    loads: {
      fingers: 0,                              // Default load for fingers
      upperBody: 0,                            // Default load for the upper body
      lowerBody: 0,                            // Default load for the lower body
    }
});