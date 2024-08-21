import { Op } from "sequelize";
import {
  TrainingSession as TrainingSessionModel,
  SessionActivity as SessionActivityModel,
  Activity as ActivityModel,
  User as UserModel,
} from "../db/models";
import { SessionActivity, TrainingSession } from "@shared/types";
import db from "../db/database";
import { fetchActivityIdByName } from "./activityService";
import { SessionActivityCreationAttributes } from "../db/models/SessionActivity.model";

/**
 * Fetches all training sessions with associated activities for a specific user within a given date range.
 */
export async function fetchSessionsForDateRange(
  auth0id: string,
  startDate: string,
  endDate: string
): Promise<TrainingSessionModel[]> {
  try {
    const dbSessions: TrainingSessionModel[] =
      await TrainingSessionModel.findAll({
        where: {
          completedOn: { [Op.between]: [startDate, endDate] },
        },
        attributes: ["id", "completedOn", "name", "note", "duration", "loads"],
        include: [
          {
            model: UserModel,
            where: {
              auth0id: auth0id,
            },
            attributes: [], // Only filter by user, no need to select any user attributes
          },
          {
            model: SessionActivityModel,
            attributes: [
              "id",
              "note",
              "startTime",
              "endTime",
              "intensities",
              "duration",
              "loads",
            ],
            include: [
              {
                model: ActivityModel,
                attributes: ["name"], // Only select the activity name
              },
            ],
          },
        ],
      });

    return dbSessions;
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    throw error;
  }
}

/**
 * Fetches a specific training session by ID for a specific user.
 */
export async function fetchSessionById(
  sessionId: number,
  auth0id: string
): Promise<TrainingSessionModel> {
  try {
    const dbSession = await TrainingSessionModel.findOne({
      where: {
        id: sessionId,
      },
      attributes: ["id", "completedOn", "name", "note", "duration", "loads"],
      include: [
        {
          model: UserModel,
          where: {
            auth0id,
          },
          attributes: [], // Only filter by user, no need to select any user attributes
        },
        {
          model: SessionActivityModel,
          attributes: [
            "id",
            "note",
            "startTime",
            "endTime",
            "intensities",
            "duration",
            "loads",
          ],
          include: [
            {
              model: ActivityModel,
              attributes: ["name"], // Only select the activity name
            },
          ],
        },
      ],
    });

    if (!dbSession) {
      console.error(
        `Session not found for ID: ${sessionId} and Auth0ID: ${auth0id}`
      );
      throw new Error("Session not found");
    }

    return dbSession;
  } catch (error) {
    console.error("Error fetching user session:", {
      sessionId,
      auth0id,
    });
    throw new Error("Failed to fetch session");
  }
}

export async function createTrainingSession(
  sessionData: TrainingSession,
  userId: number
): Promise<TrainingSessionModel> {
  return await db.sequelize.transaction(async (transaction) => {
    const newSession = await TrainingSessionModel.create(
      {
        userId: userId,
        completedOn: sessionData.completedOn,
        name: sessionData.name || undefined,
        note: sessionData.note || undefined,
      },
      { transaction }
    );

    const activitiesWithSessionId: SessionActivityCreationAttributes[] =
      await Promise.all(
        sessionData.sessionActivities.map(async (sa: SessionActivity) => ({
          activityId: await fetchActivityIdByName(sa.name),
          trainingSessionId: newSession.id,
          fingersIntensity: sa.intensities.fingers,
          upperIntensity: sa.intensities.upperBody,
          lowerIntensity: sa.intensities.lowerBody,
          startTime: sa.startTime,
          endTime: sa.endTime,
          note: sa.note || undefined,
        }))
      );

    // Bulk create the session activities
    await SessionActivityModel.bulkCreate(activitiesWithSessionId, {
      transaction,
    });

    return newSession;
  });
}

export async function updateTrainingSession(
  sessionId: number,
  sessionData: TrainingSession,
  auth0id: string
) {
  // Fetch existing session
  const existingSession = await fetchSessionById(sessionId, auth0id);

  // Transaction the updates
  await db.sequelize.transaction(async (transaction) => {
    // Update existing session
    await existingSession.update(
      {
        completedOn: sessionData.completedOn,
        name: sessionData.name,
        note: sessionData.note,
      },
      { transaction }
    );

    for (const sa of sessionData.sessionActivities) {
      await SessionActivityModel.upsert(
        {
          id: sa.id || undefined,
          activityId: await fetchActivityIdByName(sa.name),
          trainingSessionId: existingSession.id,
          fingersIntensity: sa.intensities.fingers,
          upperIntensity: sa.intensities.upperBody,
          lowerIntensity: sa.intensities.lowerBody,
          startTime: sa.startTime,
          endTime: sa.endTime,
          note: sa.note || undefined,
        },
        { transaction }
      );
    }
  });
}

/**
 * Deletes a training session and its associated session activities.
 * @param sessionId - The ID of the training session to delete.
 * @returns A promise that resolves when the session is deleted.
 */
export async function destroyTrainingSession(sessionId: number): Promise<void> {
  await db.sequelize.transaction(async (transaction) => {
    // Delete associated SessionActivities
    await SessionActivityModel.destroy({
      where: { trainingSessionId: sessionId },
      transaction,
    });

    // Delete the TrainingSession
    await TrainingSessionModel.destroy({
      where: { id: sessionId },
      transaction,
    });
  });
}
