import { Router } from "express";
const router = Router();
import {
  getSessionsForDateRange,
  createSession,
  updateSession,
  deleteSession,
  getSessionById,
} from "../controllers/sessionsController.js";

router.get("/:sessionId", getSessionById);
router.get("/", getSessionsForDateRange); // e.g., /api/sessions?startDate=2024-04-01&endDate=2024-06-01
router.post("/", createSession);
router.put("/:sessionId", updateSession);
router.delete("/:sessionId", deleteSession);

export default router;
