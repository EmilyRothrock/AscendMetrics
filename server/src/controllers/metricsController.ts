import { DateTime } from "luxon";
import { fetchSessionsForDateRange } from "../services/trainingSessionService";
import { calculateMetricsForDateRange } from "../utils/calculations/metricsTableCalcs";
import { TrainingSession as TrainingSessionModel } from "../db/models";
import { TrainingSession } from "@shared/types";
import mapTrainingSessionModelToObject from "../utils/mappings/mapTrainingSessionModelToObject";

/**
 * Asynchronously fetches user sessions and calculates metrics for a specified date range.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
export const getMetricsWithSessionsForDateRange = async (
  req: any,
  res: any
) => {
  try {
    const auth0id = req.user.sub;
    const { startDate, endDate } = req.query;
    const startDateObj = DateTime.fromISO(startDate);

    if (!startDateObj.isValid) {
      throw new Error("invalid date");
    }

    const earlyStart = startDateObj.minus({ months: 1 }).toISO();

    const fetchedSessions: TrainingSessionModel[] =
      await fetchSessionsForDateRange(auth0id, earlyStart, endDate);

    const mappedSessions: TrainingSession[] = fetchedSessions.map(
      mapTrainingSessionModelToObject
    );

    const metricsTable = calculateMetricsForDateRange(
      startDate,
      endDate,
      mappedSessions
    );

    res.json({ sessions: mappedSessions, metricsTable });
  } catch (error) {
    console.error("Failed to calculate metrics:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
