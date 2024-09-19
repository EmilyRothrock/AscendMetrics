import BodyPartMetrics from "./bodyPartMetrics";

interface SessionActivity {
  id: number;
  name: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  note?: string;
  duration: number; // In minutes
  intensities: BodyPartMetrics;
  loads: BodyPartMetrics;
}

export default SessionActivity;
