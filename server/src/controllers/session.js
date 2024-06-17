const { DateTime } = require('luxon');
const db = require('../db/database');
const {
    calculateDurationInMinutes,
    calculateActivityLoads,
    formatSessionResponse,
    verifySessionOwnership,
    createActivities,
    updateOrCreateActivities
} = require('./helpers');

/**
 * Get sessions within a specified date range for the authenticated user. Does NOT also supply metrics calculations for that date range.
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
