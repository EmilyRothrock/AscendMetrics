const { DateTime } = require('luxon');
const db = require('../db/database');

/* Session and Activity Statistics */

function processSessionStats(sessions) {
    return sessions.map(session => {
        const activities = session.activities.map(activity => {
            const durationInMinutes = calculateDurationInMinutes(activity.start, activity.end);
            const loads = calculateActivityLoads(durationInMinutes, {
                fingers: activity.fingerIntensity,
                upperBody: activity.upperIntensity,
                lowerBody: activity.lowerIntensity
            });

            return {
                id: activity.id,
                name: activity.name,
                startTime: activity.start,
                endTime: activity.end,
                notes: activity.note,
                duration: durationInMinutes, // in minutes
                intensities: {
                    fingers: activity.fingerIntensity,
                    upperBody: activity.upperIntensity,
                    lowerBody: activity.lowerIntensity
                },
                loads: loads
            };
        });

        return calculateSessionDurationAndLoads(session, activities);
    });
}

function calculateSessionDurationAndLoads(session, activities) {
    const { sessionDurationInMinutes, sessionLoads } = activities.reduce((acc, activity) => {
        acc.duration += activity.duration;
        acc.fingers += activity.loads.fingers;
        acc.upperBody += activity.loads.upperBody;
        acc.lowerBody += activity.loads.lowerBody;
        return acc;
    }, { duration:0, fingers: 0, upperBody: 0, lowerBody: 0 });
    
    const sessionDurationInHours = sessionDurationInMinutes / 60;

    return {
        id: session.id,
        date: session.completedOn,
        name: session.name,
        notes: session.note,
        duration: sessionDurationInHours,
        activities: activities,
        loads: sessionLoads
    };
};

function calculateDurationInMinutes(startTime, endTime) {
    const start = DateTime.fromJSDate(startTime);
    const end = DateTime.fromJSDate(endTime);
    return end.diff(start, 'minutes').minutes;
};

function calculateActivityLoads(durationInMinutes, intensities) {
    const durationInHours = durationInMinutes / 60;
    return {
        fingers: durationInHours * intensities.fingers,
        upperBody: durationInHours * intensities.upperBody,
        lowerBody: durationInHours * intensities.lowerBody
    };
};

// Authentication
// TODO: refactor as a fetch w/ auth middleware if still needed
async function verifySessionOwnership(sessionId, userId) {
    const session = await db.TrainingSession.findByPk(sessionId);
    if (!session || session.UserId !== userId) {
        throw new Error('Session not found or unauthorized');
    }
    return session;
};

/* Creation Utitilities */
async function createActivities(activities, sessionId, transaction) {
    return await Promise.all(activities.map(async activity => {
        const { name, note, startTime, endTime, intensities } = activity;
        const { fingers, upperBody, lowerBody } = intensities;

        const sqlStartTime = DateTime.fromISO(startTime).toSQL({ includeOffset: false });
        const sqlEndTime = DateTime.fromISO(endTime).toSQL({ includeOffset: false });

        const dbActivity = await db.Activity.findOne({ where: { name }, transaction });

        if (!dbActivity) {
            throw new Error(`Activity with name ${name} not found`);
        }

        const activityId = dbActivity.id;
        return await db.SessionActivity.create({
            ActivityId: activityId,
            TrainingSessionId: sessionId,
            note,
            startTime: sqlStartTime,
            endTime: sqlEndTime,
            fingerIntensity: fingers,
            upperIntensity: upperBody,
            lowerIntensity: lowerBody
        }, { transaction });
    }));
};

async function updateOrCreateActivities(activities, sessionId, transaction) {
    return await Promise.all(activities.map(async activity => {
        const { id, name, note, startTime, endTime, intensities } = activity;
        const { fingers, upperBody, lowerBody } = intensities;

        const sqlStartTime = DateTime.fromISO(startTime).toSQL({ includeOffset: false });
        const sqlEndTime = DateTime.fromISO(endTime).toSQL({ includeOffset: false });

        if (!id) {
            return await db.SessionActivity.create({
                TrainingSessionId: sessionId,
                note,
                startTime: sqlStartTime,
                endTime: sqlEndTime,
                fingerIntensity: fingers,
                upperIntensity: upperBody,
                lowerIntensity: lowerBody
            }, { transaction });
        } else {
            const existingActivity = await db.SessionActivity.findByPk(id);
            if (existingActivity && existingActivity.TrainingSessionId === sessionId) {
                return await existingActivity.update({
                    note,
                    startTime: sqlStartTime,
                    endTime: sqlEndTime,
                    fingerIntensity: fingers,
                    upperIntensity: upperBody,
                    lowerIntensity: lowerBody
                }, { transaction });
            }
        }
    }));
};

/* Fetching Functions */

/**
 * Fetches all training sessions with associated activities for a specific user within a given date range.
 * @param {number} userId The ID of the user for whom to fetch the sessions.
 * @param {string} startDate The start date of the range (inclusive).
 * @param {string} endDate The end date of the range (inclusive).
 * @returns {Promise<Object[]>} A promise that resolves to an array of training sessions with their activities.
 */
async function fetchUserSessionsWithActivities(userId, startDate, endDate) {
    try {
      const sessions = await db.TrainingSession.findAll({
        where: {
          userId: userId,
          completedOn: {
            [db.Sequelize.Op.between]: [startDate, endDate]
          }
        },
        include: [{
          model: db.SessionActivity,
          include: [db.Activity]
        }]
      });
  
      return sessions.map(session => ({
        id: session.id,
        name: session.name,
        completedOn: session.completedOn,
        activities: session.SessionActivities.map(sa => ({
          id: sa.id,
          name: sa.Activity.name,
          description: sa.Activity.description,
          startTime: sa.startTime,
          endTime: sa.endTime,
          fingerIntensity: sa.fingerIntensity,
          upperIntensity: sa.upperIntensity,
          lowerIntensity: sa.lowerIntensity,
          note: sa.note
        }))
      }));
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      throw error;
    }
}

module.exports = {
    processSessionStats,
    calculateSessionDurationAndLoads,
    calculateDurationInMinutes,
    calculateActivityLoads,
    verifySessionOwnership,
    createActivities,
    updateOrCreateActivities,
    fetchUserSessionsWithActivities
};