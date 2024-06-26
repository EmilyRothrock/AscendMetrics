import { SerializedError } from "@reduxjs/toolkit";
import { Session } from "./session";

export interface SessionsState {
    sessions: Record<number, Session>;
    sessionIds: number[];  // A list of ids sorted by date (newest to oldest)
    loading: boolean;
    error: SerializedError | null;
}