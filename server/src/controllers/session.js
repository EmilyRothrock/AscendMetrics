const { DateTime } = require('luxon');
const db = require('../db/database');

/**
 * Verify that a session belongs to the authenticated user.
 * @param {number} sessionId - The ID of the session to verify.
 * @param {number} userId - The ID of the authenticated user.
 * @returns {Promise<Object>} - The session if verification is successful.
 * @throws {Error} - If the session is not found or the user is unauthorized.
 */
const verifySessionOwnership = async (sessionId, userId) => {
    const session = await db.TrainingSession.findByPk(sessionId);
    if (!session || session.UserId !== userId) {
        throw new Error('Session not found or unauthorized');
    }
    return session;
};

/**
 * Create activities in the database within a transaction.
 * @param {Array} activities - The activities to create.
 * @param {number} sessionId - The ID of the session to associate the activities with.
 * @param {Object} transaction - The database transaction object.
 * @returns {Promise<Array>} - The created activities.
 */
const createActivities = async (activities, sessionId, transaction) => {
    return await Promise.all(activities.map(async activity => {
        const { name, note, startTime, endTime, intensities } = activity;
        const { fingers, upperBody, lowerBody } = intensities;

        // Ensure start and end are valid date strings
        const sqlStartTime = DateTime.fromISO(startTime).toSQL({ includeOffset: false });
        const sqlEndTime = DateTime.fromISO(endTime).toSQL({ includeOffset: false });

        // Fetch the activity from the database based on the name
        const dbActivity = await db.Activity.findOne({ where: { name }, transaction });

        if (!dbActivity) {
            throw new Error(`Activity with name ${name} not found`);
        }

        // Set the ActivityId to the ID of the fetched activity
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

/**
 * Update or create activities in the database within a transaction.
 * @param {Array} activities - The activities to update or create.
 * @param {number} sessionId - The ID of the session to associate the activities with.
 * @param {Object} transaction - The database transaction object.
 * @returns {Promise<Array>} - The updated or created activities.
 */
const updateOrCreateActivities = async (activities, sessionId, transaction) => {
    return await Promise.all(activities.map(async activity => {
        const { name, note, startTime, endTime, intensities } = activity;
        const { fingers, upperBody, lowerBody } = intensities;

        // Ensure start and end are valid date strings
        const sqlStartTime = DateTime.fromISO(startTime).toSQL({ includeOffset: false });
        const sqlEndTime = DateTime.fromISO(endTime).toSQL({ includeOffset: false });

        if (id < 0) {
            // Create new activity
            return await db.SessionActivity.create({
                TrainingSessionId: sessionId,
                note,
                startTime: sqlStartTime,
                endTime: sqlEndTime,
                fingerIntensity,
                upperIntensity,
                lowerIntensity
            }, { transaction });
        } else {
            // Update existing activity
            const existingActivity = await db.SessionActivity.findByPk(id);
            if (existingActivity && existingActivity.TrainingSessionId === sessionId) {
                return await existingActivity.update({
                    note,
                    startTime,
                    endTime,
                    fingerIntensity,
                    upperIntensity,
                    lowerIntensity
                }, { transaction });
            }
        }
    }));
};

/**
 * Calculate the duration of an activity in minutes.
 * @param {string} startTime - The start time of the activity in ISO format.
 * @param {string} endTime - The end time of the activity in ISO format.
 * @returns {number} - The duration of the activity in minutes.
 */
const calculateDurationInMinutes = (startTime, endTime) => {
    const start = DateTime.fromISO(startTime);
    const end = DateTime.fromISO(endTime);
    return end.diff(start, 'minutes').minutes;
};

/**
 * Calculate the loads of an activity based on its duration and intensities.
 * @param {number} durationInMinutes - The duration of the activity in minutes.
 * @param {Object} intensities - The intensities of the activity.
 * @returns {Object} - The calculated loads for fingers, upper body, and lower body.
 */
const calculateActivityLoads = (durationInMinutes, intensities) => {
    const durationInHours = durationInMinutes / 60;
    return {
        fingers: durationInHours * intensities.fingers,
        upperBody: durationInHours * intensities.upperBody,
        lowerBody: durationInHours * intensities.lowerBody
    };
};

/**
 * Format the session response.
 * @param {Object} session - The session object.
 * @param {Array} activities - The activities associated with the session.
 * @returns {Object} - The formatted session response.
 */
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

/**
 * Get sessions within a specified date range for the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getSessions = async (req, res) => {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;  // Assuming Passport sets req.user

    try {
        // Fetch sessions from the database within the date range
        const sessions = await db.TrainingSession.findAll({
            where: {
                UserId: userId,
                completedOn: {
                    [db.Sequelize.Op.between]: [startDate, endDate]
                }
            },
            include: {
                model: db.SessionActivity
            }
        });

        // Process sessions and calculate durations and loads
        const formattedSessions = sessions.map(session => {
            const activities = session.SessionActivities.map(activity => {
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

            return formatSessionResponse(session, activities);
        });

        // Send formatted sessions back in the response
        res.json(formattedSessions);
    } catch (error) {
        console.error('Error fetching sessions:', error);
        res.status(500).json({ error: 'Failed to fetch sessions' });
    }
};

/**
 * Create a new training session for the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const createSession = async (req, res) => {
    const newSession = req.body;
    const userId = req.user.id;
    console.log("Logging Request: ", {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body,
        activities: req.body.activities,
        params: req.params,
        query: req.query,
    });

    const { completedOn, name, note, activities } = newSession;

    const transaction = await db.sequelize.transaction();

    try {
        // Create the session in the database
        const createdSession = await db.TrainingSession.create({
            completedOn,
            name,
            note,
            UserId: userId
        }, { transaction });

        // Create activities
        const createdActivities = await createActivities(activities, createdSession.id, transaction);

        // Commit the transaction
        await transaction.commit();

        // Attach the created activities to the created session
        createdSession.activities = createdActivities;

        // Send the created session back in the response, including the new activity IDs
        res.status(201).json(createdSession);
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Failed to create session' });
    }
};

/**
 * Update an existing training session for the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const updateSession = async (req, res) => {
    const { sessionId } = req.params;
    const updatedSession = req.body;
    const userId = req.user.id;

    const { completedOn, name, note, activities } = updatedSession;

    const transaction = await db.sequelize.transaction();

    try {
        // Verify session ownership
        const session = await verifySessionOwnership(sessionId, userId);

        // Update session details
        await session.update({
            completedOn,
            name,
            note
        }, { transaction });

        // Update or create activities
        const updatedActivities = await updateOrCreateActivities(activities, session.id, transaction);

        // Commit the transaction
        await transaction.commit();

        // Attach the updated activities to the updated session
        session.activities = updatedActivities;

        // Send the updated session back in the response
        res.json(session);
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        console.error('Error updating session:', error);
        res.status(500).json({ error: 'Failed to update session' });
    }
};

/**
 * Delete an existing training session for the authenticated user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const deleteSession = async (req, res) => {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const transaction = await db.sequelize.transaction();

    try {
        // Verify session ownership
        await verifySessionOwnership(sessionId, userId);

        // Delete associated activities
        await db.SessionActivity.destroy({ where: { TrainingSessionId: sessionId }, transaction });

        // Delete the session
        await db.TrainingSession.destroy({ where: { id: sessionId }, transaction });

        // Commit the transaction
        await transaction.commit();

        // Send no content status
        res.status(204).send();
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        console.error('Error deleting session:', error);
        res.status(500).json({ error: 'Failed to delete session' });
    }
};

module.exports = { getSessions, createSession, updateSession, deleteSession };
