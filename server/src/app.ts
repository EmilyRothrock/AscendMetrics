import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db/database";
import sessionsRouter from "./routes/sessionsRoutes";
import metricsRouter from "./routes/metricsRoutes";
import { checkJwt } from "./middlewares/authMiddleware";
import { SessionActivity } from "./db/models/SessionActivity.model";

// Load environment variables
dotenv.config({ path: "../server/.env" });

const app = express();
const port = process.env.PORT || 3000;

// Global middlewares that run on every request
const corsOptions = { origin: "http://localhost:5173", credentials: true };
app.use(cors(corsOptions)); // Enable CORS for all routes
app.use(express.json());

const seedData = {
  activityId: 1, // Replace with the actual Activity ID from your database
  trainingSessionId: 1, // Replace with the actual TrainingSession ID from your database
  startTime: "16:00:00",
  endTime: "16:15:00",
  fingerIntensity: 9.0,
  upperIntensity: 6.0,
  lowerIntensity: 2.0,
  note: "5.11 double, fell 1/3 way on second lap",
  createdAt: new Date("2024-11-15T00:00:00Z"),
  updatedAt: new Date("2024-11-15T00:00:00Z"),
};

// Sync the database and start the server
db.sequelize
  .sync()
  .then(async () => {
    console.log("Database synchronized!");

    try {
      const existingActivity = await SessionActivity.findOne({
        where: { startTime: seedData.startTime, endTime: seedData.endTime },
      });

      if (!existingActivity) {
        await SessionActivity.create(seedData);
        console.log("Seed data inserted successfully!");
      } else {
        console.log("Seed data already exists, skipping insertion.");
      }
    } catch (error) {
      console.error("Error inserting seed data:", error);
    }

    // Define routes
    app.use(checkJwt); // JWT validation for all routes
    app.use("/sessions", sessionsRouter);
    app.use("/metrics", metricsRouter);

    // Begin listening for requests
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Unable to synchronize database:", err);
  });
