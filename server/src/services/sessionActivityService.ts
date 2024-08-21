import { Transaction } from "sequelize";
import { fetchActivityByName } from "./activityService";
import { DateTime } from "luxon";
import { SessionActivity as SessionActivityType } from "@shared/types";
import { SessionActivity as SessionActivityModel } from "../db/models";

export async function createSessionActivity(
  activity: SessionActivityType,
  sessionId: number,
  transaction: Transaction
): Promise<SessionActivityModel> {
  const dbActivity = await fetchActivityByName(activity.name, transaction);
  const startTime = DateTime.fromISO(activity.startTime).toFormat("HH:mm:ss");
  const endTime = DateTime.fromISO(activity.endTime).toFormat("HH:mm:ss");

  return await SessionActivityModel.create(
    {
      activityId: dbActivity.id,
      trainingSessionId: sessionId,
      note: activity.note,
      startTime: startTime,
      endTime: endTime,
      fingersIntensity: activity.intensities.fingers,
      upperIntensity: activity.intensities.upperBody,
      lowerIntensity: activity.intensities.lowerBody,
    },
    { transaction }
  );
}

export async function updateOrCreateSessionActivity(
  sessionActivity: SessionActivityType,
  sessionActivityId: number,
  transaction: Transaction
): Promise<SessionActivityModel> {
  const activity = await fetchActivityByName(sessionActivity.name, transaction);
  const startTime = DateTime.fromISO(sessionActivity.startTime).toFormat(
    "HH:mm:ss"
  );
  const endTime = DateTime.fromISO(sessionActivity.endTime).toFormat(
    "HH:mm:ss"
  );

  if (!sessionActivity.id || sessionActivity.id < 0) {
    return await SessionActivityModel.create(
      {
        trainingSessionId: sessionActivityId,
        activityId: activity.id,
        note: sessionActivity.note,
        startTime: startTime,
        endTime: endTime,
        fingersIntensity: sessionActivity.intensities.fingers,
        upperIntensity: sessionActivity.intensities.upperBody,
        lowerIntensity: sessionActivity.intensities.lowerBody,
      },
      { transaction }
    );
  } else {
    const existingSessionActivity = await SessionActivityModel.findByPk(
      sessionActivity.id,
      {
        transaction,
      }
    );

    if (!existingSessionActivity) {
      throw new Error("Existing Session Activity Not Found");
    }

    return await existingSessionActivity.update(
      {
        activityId: activity.id,
        note: sessionActivity.note,
        startTime: startTime,
        endTime: endTime,
        fingersIntensity: sessionActivity.intensities.fingers,
        upperIntensity: sessionActivity.intensities.upperBody,
        lowerIntensity: sessionActivity.intensities.lowerBody,
      },
      { transaction }
    );
  }
}
