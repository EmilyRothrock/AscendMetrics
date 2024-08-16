import express from "express";
import cors from "cors";
import { config as configDotenv } from "dotenv";
import db from "./db/database.js";
import sessionsRouter from "./routes/sessionsRoutes.js";
import metricsRouter from "./routes/metricsRoutes.js";
import { checkJwt } from "./middlewares/authMiddleware.ts";

// Load environment variables
configDotenv();

const { sequelize, syncDatabase } = db;
const app = express();
const port = process.env.PORT || 3000;

// Global middlewares that run on every request
const corsOptions = {
  origin: "http://localhost:5173", // Allow only your frontend origin
  credentials: true, // Allow cookies to be sent with requests
};
app.use(cors(corsOptions)); // Enable CORS for all routes
app.use(express.json());

// Sync the database and start the server
db.sequelize
  .sync()
  .then(() => {
    console.log("Database synchronized!");

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
