import {
  createTrainingSession,
  fetchSessionById,
  fetchSessionsForDateRange,
  updateTrainingSession,
  destroyTrainingSession,
} from "../services/trainingSessionService";
import { TrainingSession as TrainingSessionModel } from "../db/models";
import mapTrainingSessionModelToObject from "../utils/mappings/mapTrainingSessionModelToObject";
import { TrainingSession } from "@shared/types";
import { getUserByAuth0Id } from "../services/userService";

/**
 * Get a single session by ID for the authenticated user. Confirms that the user requesting it is the one who completed it.
 */
export const getSessionById = async (req: any, res: any) => {
  const { sessionId } = req.params;
  const auth0id = req.user.sub;

  try {
    const dbSession: TrainingSessionModel = await fetchSessionById(
      sessionId,
      auth0id
    );
    const mappedSession: TrainingSession =
      mapTrainingSessionModelToObject(dbSession);

    res.json(mappedSession);
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ error: "Failed to fetch session" });
  }
};

/**
 * Get sessions within a specified date range for the authenticated user. Does NOT also supply metrics calculations for that date range.
 */
export const getSessionsForDateRange = async (req: any, res: any) => {
  const { startDate, endDate } = req.query;
  const userId = req.user.id;

  try {
    const sessions: TrainingSessionModel[] = await fetchSessionsForDateRange(
      userId,
      startDate,
      endDate
    );
    const mappedSessions: TrainingSession[] = sessions.map(
      mapTrainingSessionModelToObject
    );

    res.json(mappedSessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

/**
 * Create a new training session for the authenticated user.
 */
export const createSession = async (req: any, res: any) => {
  try {
    const auth0id = req.user?.sub;
    if (!auth0id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await getUserByAuth0Id(auth0id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const sessionData: TrainingSession = req.body;

    const createdSession: TrainingSessionModel = await createTrainingSession(
      sessionData,
      user.id
    );

    const fetchedSession: TrainingSessionModel = await fetchSessionById(
      createdSession.id,
      auth0id
    );

    const mappedSession: TrainingSession =
      mapTrainingSessionModelToObject(fetchedSession);

    return res.status(201).json(mappedSession);
  } catch (error) {
    console.error("Error creating session:", error);
    return res.status(500).json({ error: "Failed to create session" });
  }
};

/**
 * Update an existing training session for the authenticated user.
 */
export const updateSession = async (req: any, res: any) => {
  const auth0id = req.user?.sub; // Assuming you're using Auth0 and the user is authenticated
  if (!auth0id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { sessionId } = req.params;
  const sessionData: TrainingSession = req.body;

  try {
    await updateTrainingSession(sessionId, sessionData, auth0id);

    const updatedSession: TrainingSessionModel = await fetchSessionById(
      sessionId,
      auth0id
    );

    const mappedSession: TrainingSession =
      mapTrainingSessionModelToObject(updatedSession);

    return res.status(200).json(mappedSession);
  } catch (error) {
    console.error("Error updating training session:", error);
    return res
      .status(500)
      .json({ message: "Failed to update training session" });
  }
};

/**
 * Delete an existing training session for the authenticated user.
 */
export const deleteSession = async (req: any, res: any) => {
  const { sessionId } = req.params;
  const auth0id = req.user.sub;

  if (!auth0id) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    await destroyTrainingSession(sessionId);

    return res
      .status(200)
      .json({ message: "Training session deleted successfully" });
  } catch (error) {
    console.error("Error deleting training session:", error);
    return res.status(500).json({ error: "Failed to delete training session" });
  }
};
