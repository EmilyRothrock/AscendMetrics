import { createReadStream } from "fs";
import { join } from "path";
import csv from "csv-parser";
import { Activity as _Activity, sequelize, syncDatabase } from "../database.js"; // Adjust the path to your database.js file
const Activity = _Activity;

// Function to import activities from CSV
async function importActivities() {
  const activities = [];
  const csvFilePath = join(__dirname, "default_activities.csv");

  return new Promise((resolve, reject) => {
    createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (row) => {
        activities.push(row);
      })
      .on("end", async () => {
        console.log("CSV file successfully processed");

        try {
          for (const activity of activities) {
            await Activity.create({
              name: activity.name,
              description: activity.description,
            });
          }

          console.log("All activities have been imported successfully.");
          resolve();
        } catch (err) {
          console.error("Error inserting data:", err);
          reject(err);
        }
      })
      .on("error", (err) => {
        console.error("Error reading CSV file:", err);
        reject(err);
      });
  });
}

// Function to run the import and handle connection
async function run() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
    await syncDatabase();
    await importActivities();
  } catch (err) {
    console.error("Error during database connection or data import:", err);
  } finally {
    console.log("Closing the database connection.");
    await sequelize.close();
  }
}

run();
