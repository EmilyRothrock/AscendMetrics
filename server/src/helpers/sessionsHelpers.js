const { DateTime } = require('luxon');
const db = require('../db/database');
const { incrementLoads } = require('./metricsHelpers')

/* Creation Utitilities */
async function createActivity(activity, sessionId, transaction) {
    const dbActivity = await fetchActivityByName(activity.name, transaction);

    return await db.SessionActivity.create({
        ActivityId: dbActivity.id,
        TrainingSessionId: sessionId,
        note: activity.note,
        startTime: activity.startTime,
        endTime: activity.endTime,
        fingerIntensity: activity.intensities.fingers,
        upperIntensity: activity.intensities.upperBody,
        lowerIntensity: activity.intensities.lowerBody
    }, { transaction });
};

async function updateOrCreateActivity(activity, sessionId, transaction) {
    const dbActivity = await fetchActivityByName(activity.name, transaction);

    if (!activity.id || activity.id < 0) {
        return await db.SessionActivity.create({
            TrainingSessionId: sessionId,
            ActivityId: dbActivity.id,
            note: activity.note,
            startTime: activity.startTime,
            endTime: activity.endTime,
            fingerIntensity: activity.intensities.fingers,
            upperIntensity: activity.intensities.upperBody,
            lowerIntensity: activity.intensities.lowerBody
        }, { transaction });
    } else {
        const existingActivity = await db.SessionActivity.findByPk(activity.id, { transaction });
        if (existingActivity && existingActivity.TrainingSessionId === sessionId) {
            return await existingActivity.update({
                ActivityId: dbActivity.id,
                note: activity.note,
                startTime: activity.startTime,
                endTime: activity.endTime,
                fingerIntensity: activity.intensities.fingers,
                upperIntensity: activity.intensities.upperBody,
                lowerIntensity: activity.intensities.lowerBody
            }, { transaction });
        }
    }
};

/* Fetching Functions */

async function fetchActivityByName(name, transaction) {
    try {
        const dbActivity = await db.Activity.findOne({
            where: { name },
            transaction
        });
        console.log("Fetched Activity:", dbActivity);

        if (!dbActivity) {
            console.error(`Activity with name '${name}' not found`);
            throw new Error(`Activity with name '${name}' not found`);
        }
        return dbActivity;
    } catch (error) {
        console.error('Error fetching activity by name:', error);
        throw error;
    }
}

async function fetchSessionById(sessionId, userId) {
    try {
        const session = await db.TrainingSession.findOne({
            where: {
                id: sessionId,
                UserId: userId
            },
            include: [{
                model: db.SessionActivity,
                include: [db.Activity]
            }]
        });

        if (!session) {
            console.error(`Session not found for ID: ${sessionId} and UserID: ${userId}`);
            throw new Error('Session not found');
        }

        const formattedSession = formatFetchedSession(session);
        const completedSession = calculateSessionStats(formattedSession);

        return completedSession
    } catch {
        console.error('Error fetching user session:', error.message, { sessionId, userId });
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
        const sessions = await db.TrainingSession.findAll({
            where: {
            userId: userId,
            completedOn: { [db.Sequelize.Op.between]: [startDate, endDate] }
            },
            include: [{
                model: db.SessionActivity,
                include: [db.Activity]
            }]
        });
        const formattedSessions = sessions.map(session => formatFetchedSession(session));
        const completedSessions = formattedSessions.map(session => calculateSessionStats(session));
        return completedSessions;
    } catch (error) {
        console.error('Error fetching user sessions:', error);
        throw error;
    }
}

function formatFetchedSession(fetchedSession) {
    const formattedSession = {
        id: fetchedSession.id,
        name: fetchedSession.name,
        completedOn: fetchedSession.completedOn,
        activities: fetchedSession.SessionActivities.map(sa => ({
            id: sa.id,
            name: sa.Activity.name,
            startTime: sa.startTime,
            endTime: sa.endTime,
            intensities: {                
                fingers: sa.fingerIntensity,
                upperBody: sa.upperIntensity,
                lowerBody: sa.lowerIntensity,
            },
            note: sa.note
        }))
    }
    
    return formattedSession;
}

/* Session and Activity Statistics */
function calculateSessionStats(session) {
    initializeSessionStats(session);
    
    const newActivities = [];

    // Using Luxon to handle extreme values more easily
    let earliestActivityStart = DateTime.fromISO('9999-12-31T23:59:59.999');
    let latestActivityEnd = DateTime.fromISO('0001-01-01T00:00:00.000');

    session.activities.forEach(activity => {
        const newActivity = calculateActivityStats(activity);
        newActivities.push(newActivity);
        incrementLoads(session.loads, newActivity.loads);

        const activityStart = DateTime.fromJSDate(newActivity.startTime);
        const activityEnd = DateTime.fromJSDate(newActivity.endTime);

        if (activityStart < earliestActivityStart) {
            earliestActivityStart = activityStart;
        }
        if (activityEnd > latestActivityEnd) {
            latestActivityEnd = activityEnd;
        }
    });

    session.activities = newActivities;

    if (earliestActivityStart <= latestActivityEnd) {
        session.duration = latestActivityEnd.diff(earliestActivityStart, 'hours').hours;
    } else {
        session.duration = 0;
    }

    // Parsing the completedOn ISO string using Luxon and combining it with the time from earliestActivityStart
    const completedOnDate = DateTime.fromISO(session.completedOn);
    const combinedDateTime = completedOnDate.set({
        hour: earliestActivityStart.hour,
        minute: earliestActivityStart.minute,
        second: earliestActivityStart.second,
        millisecond: earliestActivityStart.millisecond
    });

    session.completedOn = combinedDateTime.toISO();

    return session;
}

function initializeSessionStats(session) {
    session.duration = 0;
    session.loads = {
        fingers: 0,
        upperBody: 0,
        lowerBody: 0
    }

    return session;
}

function calculateActivityStats(activity) {
    const durationInMinutes = calculateDurationInMinutes(activity.startTime, activity.endTime);

    activity.duration = durationInMinutes;

    const durationInHours = durationInMinutes / 60;

    const calculatedLoads = calculateLoads(durationInHours, activity.intensities);

    activity.loads = calculatedLoads;

    return activity;
}

function calculateDurationInMinutes(startTime, endTime) {
    const start = DateTime.fromJSDate(startTime);
    const end = DateTime.fromJSDate(endTime);
    return end.diff(start, 'minutes').minutes;
};

function calculateLoads(durationInHours, intensities) {
    return {
        fingers: durationInHours * intensities.fingers,
        upperBody: durationInHours * intensities.upperBody,
        lowerBody: durationInHours * intensities.lowerBody
    };
};

module.exports = {
    calculateSessionStats,
    calculateActivityStats,
    calculateDurationInMinutes,
    calculateLoads,
    createActivity,
    updateOrCreateActivity,
    fetchSessionById,
    fetchSessionsForDateRange
};