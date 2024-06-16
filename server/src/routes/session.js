const express = require('express');
const router = express.Router();
const { getSessions, createSession, updateSession, deleteSession } = require('../controllers/session');

router.get('/', getSessions); // e.g., /api/sessions?startDate=2024-04-01&endDate=2024-06-01
router.post('/', createSession);
router.put('/:sessionId', updateSession);
router.delete('/:sessionId', deleteSession);

module.exports = router;
