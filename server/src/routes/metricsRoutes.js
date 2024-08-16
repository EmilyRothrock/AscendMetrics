import { Router } from "express";
const router = Router();
import { getMetricsWithSessionsForDateRange } from "../controllers/metricsController.js";

router.get("/", getMetricsWithSessionsForDateRange); // e.g., /api/metrics?startDate=2024-04-01&endDate=2024-06-01

export default router;
