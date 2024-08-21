import { Router } from "express";
const router = Router();
import {
  getSessionsForDateRange,
  createSession,
  updateSession,
  deleteSession,
  getSessionById,
} from "../controllers/sessionsController";
import { verifyOwnership } from "../middlewares/authMiddleware";

router.get("/:sessionId", verifyOwnership, getSessionById);
router.get("/", getSessionsForDateRange); // e.g., /api/sessions?startDate=2024-04-01&endDate=2024-06-01
router.post("/", createSession);
router.put("/:sessionId", verifyOwnership, updateSession);
router.delete("/:sessionId", verifyOwnership, deleteSession);

export default router;
