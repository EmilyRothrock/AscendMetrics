import BodyPartMetrics from "./bodyPartMetrics";

interface SessionActivity {
  id: number;
  name: string;
  startTime: string; // ISO format
  endTime: string; // ISO format
  note?: string;
  duration: number; // In minutes
  intensities: BodyPartMetrics;
  loads: BodyPartMetrics;
}

export default SessionActivity;
