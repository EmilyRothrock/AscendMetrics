const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const db = require('../database'); // Adjust the path to your database.js file
const { TrainingSession, SessionActivity, Activity, User } = db;
const { DateTime } = require('luxon');

async function importSessionData(userEmail, csvFileName) {
    const csvFilePath = path.join(__dirname, csvFileName);

    if (!fs.existsSync(csvFilePath)) {
        console.error(`File ${csvFileName} not found. Please make sure the file is in the scripts folder.`);
        process.exit(1);
    }

    const dataEntries = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
            dataEntries.push(row);
        })
        .on('end', async () => {
            console.log('CSV file successfully processed');

            const transaction = await db.sequelize.transaction();
            
            try {
            // Find the user by email
            const user = await User.findOne({ where: { email: userEmail } });
            if (!user) {
                throw new Error(`User with email ${userEmail} not found`);
            }

            // Group entries by date
            const entriesByDate = dataEntries.reduce((acc, entry) => {
                const date = DateTime.fromFormat(entry.Date, 'M/d/yyyy').toISODate();
                if (!acc[date]) {
                acc[date] = [];
                }
                acc[date].push(entry);
                return acc;
            }, {});

            // Process each date's entries
            for (const [date, entries] of Object.entries(entriesByDate)) {
                // Create the Training Session for the date
                const trainingSession = await TrainingSession.create({
                completedOn: date,
                UserId: user.id
                }, { transaction });

                for (const entry of entries) {
                    const startTime = DateTime.fromFormat(`${entry.Date} ${entry['Start Time']}`, 'M/d/yyyy h:mm a').toISO();
                    const endTime = DateTime.fromFormat(`${entry.Date} ${entry['End Time']}`, 'M/d/yyyy h:mm a').toISO();

                    // Find or create the Activity
                    const activity = await Activity.findOne({ where: { name: entry.Activity } });
                        if (!activity) {
                        throw new Error(`Activity with name ${entry.Activity} not found`);
                    }
                    console.log(`Inserting SessionActivity with start: ${startTime}, end: ${endTime}`);
                    // Create the Session Activity
                    const combinedNotes = [entry.Notes, entry['(Sets + Rest) x (Reps + Rest) w/ Load']].filter(Boolean).join('; ');
                    await SessionActivity.create({
                        note: combinedNotes,
                        startTime: startTime,
                        endTime: endTime,
                        fingerIntensity: parseFloat(entry['F-RPE']),
                        upperIntensity: parseFloat(entry['U-RPE']),
                        lowerIntensity: parseFloat(entry['L-RPE']),
                        ActivityId: activity.id,
                        TrainingSessionId: trainingSession.id
                    }, { transaction });
                }
            }
            await transaction.commit();
            console.log('All data have been imported successfully.');
            resolve();
            } catch (err) {
            await transaction.rollback();
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

async function run() {
    const userEmail = process.argv[2];
    const csvFileName = process.argv[3];

    if (!userEmail || !csvFileName) {
        console.error('Please provide a user email and a CSV file name as arguments');
        process.exit(1);
    }

    try {
        await db.sequelize.authenticate();
        console.log('Database connection established successfully.');
        await db.syncDatabase();
        await importSessionData(userEmail, csvFileName);
    } catch (err) {
        console.error('Error during database connection or data import:', err);
    } finally {
        console.log('Closing the database connection.');
        await db.sequelize.close();
    }
}

run();
