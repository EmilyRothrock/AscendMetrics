import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db/database";
import sessionsRouter from "./routes/sessionsRoutes";
import metricsRouter from "./routes/metricsRoutes";
import { checkJwt } from "./middlewares/authMiddleware";
import { SessionActivity } from "./db/models/SessionActivity.model";
import sessionActivitiesData from "./db/data/default-session-activities.json"; // Import the JSON file

// Load environment variables
dotenv.config({ path: "../server/.env" });

const app = express();
const port = process.env.PORT || 3000;

// Global middlewares that run on every request
const corsOptions = { origin: "http://localhost:5173", credentials: true };
app.use(cors(corsOptions)); // Enable CORS for all routes
app.use(express.json());

// Sync the database and start the server
db.sequelize
  .sync()
  .then(async () => {
    console.log("Database synchronized!");

    try {
      // Format the JSON data to match the model attributes
      const formattedData = sessionActivitiesData.map((activity) => ({
        activityId: 1, // Replace with the actual Activity ID from your database
        trainingSessionId: 1, // Replace with the actual TrainingSession ID from your database
        startTime: activity["Start Time"],
        endTime: activity["End Time"],
        fingerIntensity: activity["F-RPE"],
        upperIntensity: activity["U-RPE"],
        lowerIntensity: activity["L-RPE"],
        note: activity.Notes,
        createdAt: new Date(activity.createdAt),
        updatedAt: new Date(activity.updatedAt),
      }));

      // Perform bulk insert
      await SessionActivity.bulkCreate(formattedData, {
        ignoreDuplicates: true, // Prevent duplicate entries
      });
      console.log("Bulk data inserted successfully!");
    } catch (error) {
      console.error("Error inserting bulk data:", error);
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
