const { calculateMetricsForDateRange } = require("../helpers/metricsHelpers");
const { fetchSessionsForDateRange, formatFetchedSession, calculateSessionStats } = require("../helpers/sessionsHelpers");
const { DateTime } = require('luxon');

/**
 * Asynchronously fetches user sessions and calculates metrics for a specified date range.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getMetricsWithSessionsForDateRange = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;
        const sessionStartDate = DateTime.fromISO(startDate).minus({ months: 1 }).toISO();

        const fetchedSessions = await fetchSessionsForDateRange(userId, sessionStartDate, endDate);
        const formattedSessions = fetchedSessions.map(session => formatFetchedSession(session));
        const completedSessions = formattedSessions.map(session => calculateSessionStats(session));

        const metricsTable = calculateMetricsForDateRange(startDate, endDate, completedSessions);

        res.json({ sessions: completedSessions, metricsTable });
    } catch (error) {
        console.error('Failed to calculate metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getMetricsWithSessionsForDateRange };