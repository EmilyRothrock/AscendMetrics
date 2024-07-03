const { calculateMetricsForDateRange } = require("../helpers/metricsHelpers");
const { fetchSessionsForDateRange } = require("../helpers/sessionsHelpers");
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

        const sessions = await fetchSessionsForDateRange(userId, sessionStartDate, endDate);

        const metricsTable = calculateMetricsForDateRange(startDate, endDate, sessions);

        console.log("Sessions: ", sessions);
        // console.log("Metrics Table: ", metricsTable);

        res.json({ sessions, metricsTable });
    } catch (error) {
        console.error('Failed to calculate metrics:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { getMetricsWithSessionsForDateRange };