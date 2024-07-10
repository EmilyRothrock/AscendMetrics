const { DateTime } = require('luxon');
const db = require('../db/database');
const {
    createActivity,
    updateOrCreateActivity,
    fetchSessionsForDateRange,
    fetchSessionById
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
        const session = await fetchSessionById(sessionId, userId);

        console.log(session);
        res.json(session);
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
        const sessions = fetchSessionsForDateRange(userId, startDate, endDate);        
        console.log(sessions);
        res.json(sessions);
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

    const { completedOn, name, note, activities } = newSession;

    const transaction = await db.sequelize.transaction();

    try {
        const createdSession = await db.TrainingSession.create({
            completedOn,
            name,
            note,
            UserId: userId
        }, { transaction });
        
        await Promise.all(activities.map(activity =>
            createActivity(activity, completedOn, createdSession.id, transaction)
        ));

        await transaction.commit();

        const fetchedSession = await fetchSessionById(createdSession.id, userId);

        res.status(201).json(fetchedSession);
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
    const { completedOn, name, note, activities } = req.body;
    const userId = req.user.id;

    const transaction = await db.sequelize.transaction();

    try {
        const session = await fetchSessionById(sessionId, userId);

        await session.update({
            completedOn,
            name,
            note
        }, { transaction });

        await Promise.all(activities.map(activity =>
            updateOrCreateActivity(activity, sessionId, transaction)
        ));

        await transaction.commit();

        const updatedSessionData = await fetchSessionById(sessionId, userId);

        res.status(200).json(updatedSessionData);
    } catch (error) {
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
        const result = await db.TrainingSession.destroy({
            where: { id: sessionId, UserId: userId },
            transaction
        });

        if (result === 0) {
            await transaction.rollback();
            return res.status(404).json({ error: 'Session not found or user mismatch' });
        }

        await db.SessionActivity.destroy({
            where: { TrainingSessionId: sessionId },
            transaction
        });

        await transaction.commit();

        res.status(204).send();
    } catch (error) {
        // Rollback the transaction in case of an error
        await transaction.rollback();
        console.error('Error deleting session:', error);
        res.status(500).json({ error: 'Failed to delete session' });
    }
};

module.exports = { getSessionById, getSessionsForDateRange, createSession, updateSession, deleteSession };