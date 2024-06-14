import { Activity } from './activity';
import { Load } from './load';
import { Strain } from './strain';

export interface Session {
    id: number;
    date: string; // ISO format
    name: string;
    notes: string;
    duration: number;
    activities: Activity[];
    loads: Load[];
    strains: Strain[];
}
