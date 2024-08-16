import { DateTime } from "luxon";
import pkg from "../db/database.js";
const { SessionActivity, Activity, TrainingSession, Sequelize } = pkg;
import { incrementLoads } from "./metricsHelpers.js";

/* Creation Utitilities */
async function createActivity(activity, sessionId, transaction) {
  const dbActivity = await fetchActivityByName(activity.name, transaction);
  const startTime = DateTime.fromISO(activity.startTime).toFormat("HH:mm:ss");
  const endTime = DateTime.fromISO(activity.endTime).toFormat("HH:mm:ss");

  return await SessionActivity.create(
    {
      ActivityId: dbActivity.id,
      TrainingSessionId: sessionId,
      note: activity.note,
      startTime: startTime,
      endTime: endTime,
      fingerIntensity: activity.intensities.fingers,
      upperIntensity: activity.intensities.upperBody,
      lowerIntensity: activity.intensities.lowerBody,
    },
    { transaction }
  );
}

async function updateOrCreateActivity(activity, sessionId, transaction) {
  const dbActivity = await fetchActivityByName(activity.name, transaction);
  const startTime = DateTime.fromISO(activity.startTime).toFormat("HH:mm:ss");
  const endTime = DateTime.fromISO(activity.endTime).toFormat("HH:mm:ss");

  if (!activity.id || activity.id < 0) {
    return await SessionActivity.create(
      {
        TrainingSessionId: sessionId,
        ActivityId: dbActivity.id,
        note: activity.note,
        startTime: startTime,
        endTime: endTime,
        fingerIntensity: activity.intensities.fingers,
        upperIntensity: activity.intensities.upperBody,
        lowerIntensity: activity.intensities.lowerBody,
      },
      { transaction }
    );
  } else {
    const existingActivity = await SessionActivity.findByPk(activity.id, {
      transaction,
    });
    if (existingActivity) {
      return await existingActivity.update(
        {
          ActivityId: dbActivity.id,
          note: activity.note,
          startTime: startTime,
          endTime: endTime,
          fingerIntensity: activity.intensities.fingers,
          upperIntensity: activity.intensities.upperBody,
          lowerIntensity: activity.intensities.lowerBody,
        },
        { transaction }
      );
    }
  }
}

/* Fetching Functions */

async function fetchActivityByName(name, transaction) {
  try {
    const dbActivity = await Activity.findOne({
      where: { name },
      transaction,
    });

    if (!dbActivity) {
      console.error(`Activity with name '${name}' not found`);
      throw new Error(`Activity with name '${name}' not found`);
    }
    return dbActivity;
  } catch (error) {
    console.error("Error fetching activity by name:", error);
    throw error;
  }
}

async function fetchSessionById(sessionId, userId) {
  try {
    const session = await TrainingSession.findOne({
      where: {
        id: sessionId,
        UserId: userId,
      },
      include: [
        {
          model: SessionActivity,
          include: [Activity],
        },
      ],
    });

    if (!session) {
      console.error(
        `Session not found for ID: ${sessionId} and UserID: ${userId}`
      );
      throw new Error("Session not found");
    }

    return session;
  } catch (error) {
    console.error("Error fetching user session:", error.message, {
      sessionId,
      userId,
    });
    throw new Error(`Failed to fetch session: ${error.message}`);
  }
}

/**
 * Fetches all training sessions with associated activities for a specific user within a given date range.
 * @param {number} userId The ID of the user for whom to fetch the sessions.
 * @param {string} startDate The start date of the range (inclusive).
 * @param {string} endDate The end date of the range (inclusive).
 * @returns {Promise<Object[]>} A promise that resolves to an array of training sessions with their activities.
 */
async function fetchSessionsForDateRange(userId, startDate, endDate) {
  try {
    const dbSessions = await TrainingSession.findAll({
      where: {
        userId: userId,
        completedOn: { [Sequelize.Op.between]: [startDate, endDate] },
      },
      include: [
        {
          model: SessionActivity,
          include: [Activity],
        },
      ],
    });
    return dbSessions;
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    throw error;
  }
}

function formatFetchedSession(fetchedSession) {
  const formattedSession = {
    id: fetchedSession.id,
    name: fetchedSession.name,
    completedOn: fetchedSession.completedOn,
    note: fetchedSession.note,
    activities: fetchedSession.SessionActivities.map((sa) => ({
      id: sa.id,
      name: sa.Activity.name,
      startTime: sa.startTime,
      endTime: sa.endTime,
      intensities: {
        fingers: sa.fingerIntensity,
        upperBody: sa.upperIntensity,
        lowerBody: sa.lowerIntensity,
      },
      note: sa.note,
    })),
  };

  return formattedSession;
}

/* Session and Activity Statistics */
function calculateSessionStats(session) {
  initializeSessionStats(session);

  const newActivities = [];

  const sessionDate = DateTime.fromISO(session.completedOn).toISODate();
  // Using Luxon to handle extreme values more easily
  let earliestActivityStart = DateTime.fromISO(`${sessionDate}T23:59:59.999`);
  let latestActivityEnd = DateTime.fromISO(`${sessionDate}T00:00:00.000`);

  session.activities.forEach((activity) => {
    const newActivity = calculateActivityStats(activity);
    newActivities.push(newActivity);
    incrementLoads(session.loads, newActivity.loads);

    const activityStart = DateTime.fromISO(
      `${sessionDate}T${newActivity.startTime}`
    );
    const activityEnd = DateTime.fromISO(
      `${sessionDate}T${newActivity.endTime}`
    );

    if (activityStart < earliestActivityStart) {
      earliestActivityStart = activityStart;
    }
    if (activityEnd > latestActivityEnd) {
      latestActivityEnd = activityEnd;
    }
  });

  session.activities = newActivities;

  // Adjust for crossing midnight: if the end is before the start, add one day
  if (latestActivityEnd < earliestActivityStart) {
    latestActivityEnd = latestActivityEnd.plus({ days: 1 });
  }

  if (earliestActivityStart <= latestActivityEnd) {
    session.duration = latestActivityEnd.diff(
      earliestActivityStart,
      "hours"
    ).hours;
  } else {
    session.duration = 0;
  }

  // Parsing the completedOn ISO string using Luxon and combining it with the time from earliestActivityStart
  const completedOnDate = DateTime.fromISO(session.completedOn);
  const combinedDateTime = completedOnDate.set({
    hour: earliestActivityStart.hour,
    minute: earliestActivityStart.minute,
    second: earliestActivityStart.second,
    millisecond: earliestActivityStart.millisecond,
  });

  session.completedOn = combinedDateTime.toISO();

  return session;
}

function initializeSessionStats(session) {
  session.duration = 0;
  session.loads = {
    fingers: 0,
    upperBody: 0,
    lowerBody: 0,
  };

  return session;
}

function calculateActivityStats(activity) {
  const durationInMinutes = calculateDurationInMinutes(
    activity.startTime,
    activity.endTime
  );

  activity.duration = durationInMinutes;

  const durationInHours = durationInMinutes / 60;

  const calculatedLoads = calculateLoads(durationInHours, activity.intensities);

  activity.loads = calculatedLoads;

  return activity;
}

function calculateDurationInMinutes(startTime, endTime) {
  // Assuming the same date for both times since only times are provided
  const dateContext = "2024-01-01"; // Use any arbitrary date

  const start = DateTime.fromISO(`${dateContext}T${startTime}`);
  let end = DateTime.fromISO(`${dateContext}T${endTime}`);

  // Handling cases where endTime might be on the next day (cross midnight scenario)
  if (end < start) {
    end = end.plus({ days: 1 });
  }

  return end.diff(start, "minutes").minutes;
}

function calculateLoads(durationInHours, intensities) {
  return {
    fingers: durationInHours * intensities.fingers,
    upperBody: durationInHours * intensities.upperBody,
    lowerBody: durationInHours * intensities.lowerBody,
  };
}

export {
  calculateSessionStats,
  calculateActivityStats,
  calculateDurationInMinutes,
  calculateLoads,
  createActivity,
  updateOrCreateActivity,
  fetchSessionById,
  fetchSessionsForDateRange,
  formatFetchedSession,
};
