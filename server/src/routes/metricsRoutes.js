const express = require('express');
const router = express.Router();
const { getMetricsWithSessionsForDateRange } = require('../controllers/metricsController');

router.get('/', getMetricsWithSessionsForDateRange); // e.g., /api/metrics?startDate=2024-04-01&endDate=2024-06-01

module.exports = router;
