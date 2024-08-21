import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./db/database";
import sessionsRouter from "./routes/sessionsRoutes";
import metricsRouter from "./routes/metricsRoutes";
import { checkJwt } from "./middlewares/authMiddleware";

// Load environment variables
dotenv.config({ path: "../server/.env" });

const app = express();
const port = process.env.PORT || 3000;

// Global middlewares that run on every request
const corsOptions = { origin: "http://localhost:5173" };
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
