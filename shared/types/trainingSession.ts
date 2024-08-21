import SessionActivity from "./sessionActivity";
import BodyPartMetrics from "./bodyPartMetrics";

interface TrainingSession {
  id: number;
  completedOn: string; // ISO format
  name?: string;
  note?: string;
  duration: number; // hours
  sessionActivities: SessionActivity[];
  loads: BodyPartMetrics;
}

export default TrainingSession;
