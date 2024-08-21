import { SerializedError } from "@reduxjs/toolkit";
import { TrainingSession } from "@shared/types";

export interface SessionsState {
  sessions: Record<number, TrainingSession>;
  sessionIds: number[]; // A list of ids sorted by date (newest to oldest)
  loading: boolean;
  error: SerializedError | null;
}
