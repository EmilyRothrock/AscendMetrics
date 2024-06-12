import { Activity } from './activity';
import { Load } from './load';
import { Strain } from './strain';

export interface Session {
    id: number;
    dateTime: string;
    name: string;
    notes: string;
    duration: number;
    activities: Activity[];
    loads: Load[];
    strains: Strain[];
}
