const { DateTime } = require('luxon');
const db = require('../db/database');

export const calculateDurationInMinutes = (startTime, endTime) => {
    const start = DateTime.fromISO(startTime);
    const end = DateTime.fromISO(endTime);
    return end.diff(start, 'minutes').minutes;
};

const calculateActivityLoads = (durationInMinutes, intensities) => {
    const durationInHours = durationInMinutes / 60;
    return {
        fingers: durationInHours * intensities.fingers,
        upperBody: durationInHours * intensities.upperBody,
        lowerBody: durationInHours * intensities.lowerBody
    };
};

const formatSessionResponse = (session, activities) => {
    const sessionDurationInMinutes = activities.reduce((acc, activity) => acc + activity.duration, 0);
    const sessionDurationInHours = sessionDurationInMinutes / 60;
    const sessionLoads = activities.reduce((acc, activity) => {
        acc.fingers += activity.loads.fingers;
        acc.upperBody += activity.loads.upperBody;
        acc.lowerBody += activity.loads.lowerBody;
        return acc;
    }, { fingers: 0, upperBody: 0, lowerBody: 0 });

    return {
        id: session.id,
        date: session.completedOn,
        name: session.name,
        notes: session.note,
        duration: sessionDurationInHours, // in hours
        activities: activities,
        loads: sessionLoads
    };
};

const verifySessionOwnership = async (sessionId, userId) => {
    const session = await db.TrainingSession.findByPk(sessionId);
    if (!session || session.UserId !== userId) {
        throw new Error('Session not found or unauthorized');
    }
    return session;
};

const createActivities = async (activities, sessionId, transaction) => {
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

const updateOrCreateActivities = async (activities, sessionId, transaction) => {
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

module.exports = {
    calculateDurationInMinutes,
    calculateActivityLoads,
    formatSessionResponse,
    verifySessionOwnership,
    createActivities,
    updateOrCreateActivities
};