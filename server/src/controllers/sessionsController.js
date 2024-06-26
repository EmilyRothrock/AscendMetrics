const db = require('../db/database');
const {
    calculateDurationInMinutes,
    calculateActivityLoads,
    calculateSessionDurationAndLoads,
    verifySessionOwnership,
    processSessionStats,
    createActivities,
    updateOrCreateActivities,
    fetchUserSessionsWithActivities
} = require('../helpers/sessionsHelpers');

/**
 * Get a single session by ID for the authenticated user. Confirms that the user requesting it is the one who completed it.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getSessionById = async (req, res) => {
    const { sessionId } = req.params;
    const userId = req.user.id;

    try {
        // Fetch the session from the database by ID and user ID
        const session = await db.TrainingSession.findOne({
            where: {
                id: sessionId,
                UserId: userId
            },
            include: {
                model: db.SessionActivity
            }
        });

        // Check if the session exists
        if (!session) {
            return res.status(404).json({ error: 'Session not found or unauthorized' });
        }

        // Process the session and calculate durations and loads
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

        const completeSession = calculateSessionDurationAndLoads(session, activities);

        res.json(completeSession);
    } catch (error) {
        console.error('Error fetching session:', error);
        res.status(500).json({ error: 'Failed to fetch session' });
    }
};

/**
 * Get sessions within a specified date range for the authenticated user. Does NOT also supply metrics calculations for that date range.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getSessionsForDateRange = async (req, res) => {
    const { startDate, endDate } = req.query;
    const userId = req.user.id;

    try {
        // Fetch sessions from the database within the date range
        const sessions = fetchUserSessionsWithActivities(userId, startDate, endDate);

        // Process sessions and calculate durations and loads
        const completedSessions = processSessionStats(sessions);
        
        // sessions are formatted as an unsorted list of sessions with unsorted activities list of objects
        res.json(completedSessions);
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
        const createdSession = await db.TrainingSession.create({
            completedOn,
            name,
            note,
            UserId: userId
        }, { transaction });

        const createdActivities = await createActivities(activities, createdSession.id, transaction);

        await transaction.commit();

        createdSession.SessionActivities = createdActivities;

        res.status(201).json(createdSession);
    } catch (error) {
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

module.exports = { getSessionById, getSessionsForDateRange, createSession, updateSession, deleteSession };