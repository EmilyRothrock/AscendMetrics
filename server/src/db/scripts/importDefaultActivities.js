const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const db = require('../database'); // Adjust the path to your database.js file
const Activity = db.Activity;

// Function to import activities from CSV
async function importActivities() {
  const activities = [];
  const csvFilePath = path.join(__dirname, 'default_activities.csv');

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        activities.push(row);
      })
      .on('end', async () => {
        console.log('CSV file successfully processed');

        try {
          for (const activity of activities) {
            await Activity.create({
              name: activity.name,
              description: activity.description
            });
          }

          console.log('All activities have been imported successfully.');
          resolve();
        } catch (err) {
          console.error('Error inserting data:', err);
          reject(err);
        }
      })
      .on('error', (err) => {
        console.error('Error reading CSV file:', err);
        reject(err);
      });
  });
}

// Function to run the import and handle connection
async function run() {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection established successfully.');
    await db.syncDatabase();
    await importActivities();
  } catch (err) {
    console.error('Error during database connection or data import:', err);
  } finally {
    console.log('Closing the database connection.');
    await db.sequelize.close();
  }
}

run();