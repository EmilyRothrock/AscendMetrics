const express = require('express');
const router = express.Router();
const { getMetrics, recalculateMetrics } = require('../controllers/metrics');

router.get('/', getMetrics); // e.g., /api/metrics?startDate=2024-04-01&endDate=2024-06-01
router.post('/recalculate', recalculateMetrics);

module.exports = router;
