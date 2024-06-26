const { calculateMetricsForDateRange, processSession } = require("../helpers/metricsHelpers");
const { fetchUserSessionsWithActivities } = require("../helpers/sessionsHelpers");
const { DateTime } = require('luxon');

/**
 * Asynchronously fetches user sessions and calculates metrics for a specified date range.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const getMetricsWithSessionsForDateRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const userId = req.user.id;
        const sessionStartDate = DateTime.fromISO(startDate).minus({ months: 1 }).toISO();

        const sessions = await fetchUserSessionsWithActivities(userId, sessionStartDate, endDate);
        const dailyLoads = {};
        const fatigues = {};

        for (const session of sessions) {
            processSession(session, dailyLoads, fatigues);
        }

        const metricsTable = calculateMetricsForDateRange(startDate, endDate, dailyLoads, fatigues);
        console.log("Sessions: ", sessions);
        console.log("Metrics Table: ", metricsTable);
        res.json({ sessions, metricsTable });
    } catch (error) {
        console.error('Failed to calculate metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getMetricsWithSessionsForDateRange };