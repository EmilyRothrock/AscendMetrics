import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db/database";
import sessionsRouter from "./routes/sessionsRoutes";
import metricsRouter from "./routes/metricsRoutes";
import { checkJwt } from "./middlewares/authMiddleware";
import { SessionActivity } from "./db/models/SessionActivity.model";
import sessionActivitiesData from "./db/data/default-session-activities.json"; // Import the JSON file
import { User } from "./db/models/User.model"; // Assuming User is your model for users
import defaultUsers from "./db/data/default-users.json"; // Import JSON file
import { parse } from "date-fns";
import { TrainingSession } from "./db/models/TrainingSession.model"; // Assuming the TrainingSession model is imported


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

    const convertToMySQLTime = (timeString: string): string => {
      const date = parse(timeString, "h:mm a", new Date()); // Parse using 12-hour format
      return date.toISOString().split("T")[1].split(".")[0]; // Extract HH:MM:SS
    };

    try {
      // Insert the default user if not already present
      const existingUser = await User.findOne({
        where: { auth0id: defaultUsers.auth0id },
      });

      if (!existingUser) {
        await User.create({
          id: defaultUsers.id,
          auth0id: defaultUsers.auth0id,
          email: defaultUsers.email,
          first: defaultUsers.first,
          last: defaultUsers.last,
          createdAt: new Date(defaultUsers.createdAt),
          updatedAt: new Date(defaultUsers.updatedAt),
        });
        console.log("Default user inserted successfully!");
      } else {
        console.log("Default user already exists, skipping insertion.");
      }

      // Check if the default TrainingSession already exists
      const existingTrainingSession = await TrainingSession.findOne({
        where: {
          userId: existingUser.id, // Assuming we're linking the session to the existing user
          completedOn: "2024-11-08", // Example date, you can customize as needed
          name: "Session 1", // Example name, can be dynamic
        },
      });

      if (!existingTrainingSession) {
        // Create a new TrainingSession entry if it doesn't exist
        const newTrainingSession = await TrainingSession.create({
          completedOn: "2024-11-08", // Example date
          name: "Session 1", // Example session name
          note: "Initial training session", // Add your note
          userId: existingUser.id, // Use the actual user ID
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log("New Training Session inserted successfully!");

        // Format the JSON data to match the model attributes
        const formattedData = sessionActivitiesData.map((activity) => ({
          activityId: 1, // Replace with the actual Activity ID from your database
          trainingSessionId: newTrainingSession.id, // Link to the newly created TrainingSession ID
          startTime: convertToMySQLTime(activity["Start Time"]),
          endTime: convertToMySQLTime(activity["End Time"]),
          fingerIntensity: activity["F-RPE"],
          upperIntensity: activity["U-RPE"],
          lowerIntensity: activity["L-RPE"],
          note: activity.Notes,
          createdAt: new Date(activity.createdAt),
          updatedAt: new Date(activity.updatedAt),
        }));

        // Check for duplicates before inserting session activities
        for (const activity of formattedData) {
          const existingActivity = await SessionActivity.findOne({
            where: {
              startTime: activity.startTime,
              endTime: activity.endTime,
              note: activity.note,
              trainingSessionId: activity.trainingSessionId,
              activityId: activity.activityId,
            },
          });

          if (!existingActivity) {
            await SessionActivity.create(activity);
            console.log(
              `Inserted session activity: ${activity.startTime} to ${activity.endTime}`
            );
          } else {
            console.log(
              `Session activity already exists: ${activity.startTime} to ${activity.endTime}`
            );
          }
        }

        console.log("Default session activities processed successfully!");
      } else {
        console.log("Default TrainingSession already exists, skipping insertion.");
      }
    } catch (error) {
      console.error("Error inserting data:", error);
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
