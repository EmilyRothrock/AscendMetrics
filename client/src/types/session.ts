import { Activity } from './activity';
import { BodyPartMetrics } from './bodyPartMetrics';

export interface Session {
    id: number;
    date: string; // ISO format
    name: string;
    notes?: string;
    duration: number; // hours
    activities: Activity[];
    loads: BodyPartMetrics;
}
