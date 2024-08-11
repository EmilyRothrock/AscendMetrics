const { DateTime } = require("luxon");
const { weightedMean, severityNormalization, quarticNormalization, inverseCubicNormalization, strainNormalization, inverseQuarticNormalization, getReadinessWeights } = require("./readinessUtils");

/** Metrics Calculations */
function calculateMetricsForDateRange(startDate, endDate, sessions) {
    //  Calculations related to sessions - stats, daily loads, fatigues
    const readinessWeights = getReadinessWeights();

    const dailyLoads = {};
    const fatigues = {};
    for (const session of sessions) {
        session.activities.forEach(activity => {
            const date = DateTime.fromISO(session.completedOn).toISODate();
            incrementDailyLoads(dailyLoads, date, activity.loads);
            incrementFatigues(fatigues, date, activity.intensities, activity.duration / 60 );
        });
    }

    // Calculations derived from daily loads and fatigues
    const alpha7 = 2 / (8);  // 7+1 for smoothing
    const alpha28 = 2 / (29);  // 28+1 for smoothing

    const bodyParts = ['fingers', 'upperBody', 'lowerBody'];

    const earlyStart = DateTime.fromISO(startDate).minus({ days: 28 });
    const start = DateTime.fromISO(startDate);
    const end = DateTime.fromISO(endDate);

    let metricsTable = {};
    let EWMA = {
        WL: {},
        ML: {},
        WLS: {},
        WLChange: {},
        WS: {},
        MS: {},
        WSS: {}
    };

    // TODO: Setting values for early start (calibration values)

    for (let currentDate = earlyStart; currentDate <= end; currentDate = currentDate.plus({ days: 1 })) {
        const dateString = currentDate.toISODate();
        const yesterdayDateString = currentDate.minus({ days: 1}).toISODate();
        const lastWeekDateString = currentDate.minus({days: 7}).toISODate();

        // Initializations
        EWMA.WL[dateString] = {};
        EWMA.ML[dateString] = {};
        const loadBalance = {};
        const loadSeverity = {};
        EWMA.WLS[dateString] = {};
        const weeklyLoadChange = {};
        EWMA.WLChange[dateString] = {};
        const dailyStrain = {};
        EWMA.WS[dateString] = {};
        EWMA.MS[dateString] = {};
        const strainBalance = {};
        const strainSeverity = {};
        const fatigueSeverity = {};
        EWMA.WSS[dateString] = {};
        const readiness = {};

        // Calculations
        bodyParts.forEach(part => {
            EWMA.WL[dateString][part] = updateEWMA(alpha7, getMetricValue(dailyLoads, yesterdayDateString, part), getMetricValue(EWMA.WL, yesterdayDateString, part));
            EWMA.ML[dateString][part] = updateEWMA(alpha28, getMetricValue(dailyLoads, yesterdayDateString, part),  getMetricValue(EWMA.ML, yesterdayDateString, part));
            dailyStrain[part] = Math.sqrt(getMetricValue(dailyLoads, dateString, part) * getMetricValue(fatigues, dateString, part));
            EWMA.WS[dateString][part] = updateEWMA(alpha7, dailyStrain[part], getMetricValue(EWMA.WS, yesterdayDateString, part));
            EWMA.MS[dateString][part] = updateEWMA(alpha28, dailyStrain[part], getMetricValue(EWMA.MS, yesterdayDateString, part));
        });

        if (currentDate >= start.minus({days: 7})) {
            bodyParts.forEach(part => {
                loadSeverity[part] = getMetricValue(dailyLoads, dateString, part) / getMetricValue(EWMA.ML, dateString, part); 
                weeklyLoadChange[part] = getMetricValue(EWMA.WL, dateString, part) / getMetricValue(EWMA.WL, lastWeekDateString, part);
                strainSeverity[part] = dailyStrain[part] / getMetricValue(EWMA.MS, dateString, part); 
                // Update corresponding EWMAs
                EWMA.WLS[dateString][part] = updateEWMA(alpha7, loadSeverity[part], getMetricValue(EWMA.WLS, yesterdayDateString, part));
                EWMA.WLChange[dateString][part] = updateEWMA(alpha7, weeklyLoadChange[part], getMetricValue(EWMA.WLChange, yesterdayDateString, part));
                EWMA.WSS[dateString][part] = updateEWMA(alpha7, strainSeverity[part], getMetricValue(EWMA.WSS, yesterdayDateString, part));
            });
        }
        
        if (currentDate >= start) {
            bodyParts.forEach(part => {
                loadBalance[part] = getMetricValue(EWMA.WL, dateString, part) / getMetricValue(EWMA.ML, dateString, part); 
                strainBalance[part] = getMetricValue(EWMA.WS, dateString, part) / getMetricValue(EWMA.MS, dateString, part); 
                fatigueSeverity[part] = getMetricValue(fatigues, dateString, part) / getMetricValue(EWMA.MS, dateString, part);
            });

            const burnoutRiskIndex = calculateBurnoutRiskIndex(dailyLoads, metricsTable, currentDate, bodyParts, EWMA.WL[dateString])

            bodyParts.forEach(part => {
                const normalizedValues = {
                    loadBalance: quarticNormalization(2, loadBalance[part]),
                    averageLoadSeverity: severityNormalization(5, EWMA.WLS[dateString][part]),
                    averageWeeklyLoadChange: quarticNormalization(2, EWMA.WLChange[dateString][part]),
                    fatigueSeverity: inverseCubicNormalization(5, fatigueSeverity[part]),
                    strainBalance: strainNormalization(2, strainBalance[part]),
                    averageStrainSeverity: inverseCubicNormalization(4, EWMA.WSS[dateString][part]),
                    burnoutRiskIndex: inverseQuarticNormalization(2.5, burnoutRiskIndex[part]),
                };
    
                readiness[part] = weightedMean(readinessWeights, normalizedValues);
            });

            // Assignments
            metricsTable[dateString] = {
                dailyLoad: dailyLoads[dateString] || { fingers:0, upperBody:0, lowerBody:0 },
                weeklyLoad: EWMA.WL[dateString],
                monthlyLoad: EWMA.ML[dateString],
                loadBalance: loadBalance,
                loadSeverity: loadSeverity,
                averageLoadSeverity: EWMA.WLS[dateString],
                weeklyLoadChange: weeklyLoadChange,
                averageWeeklyLoadChange: EWMA.WLChange[dateString],
                fatigue: fatigues[dateString],
                fatigueSeverity: fatigueSeverity,
                dailyStrain: dailyStrain,
                weeklyStrain: EWMA.WS[dateString],
                monthlyStrain: EWMA.MS[dateString],
                strainBalance: strainBalance,
                strainSeverity: strainSeverity,
                averageStrainSeverity: EWMA.WSS[dateString],
                burnoutRiskIndex: burnoutRiskIndex,
                readiness: readiness,
            };
        }
    }

    return metricsTable;
}

/**
 * Updates the Exponentially Weighted Moving Average (EWMA) for a given value.
 */
function updateEWMA(alpha, value, previousEWMA) {
    return alpha * value + (1 - alpha) * previousEWMA;
}

/**
 * Gets the value for a specific metric on a specific day, defaulting to zero if not found.
 */
function getMetricValue(metrics, date, part) {
    return metrics[date]?.[part] ?? 0;
}

function calculateBurnoutRiskIndex(dailyLoads, metricsTable, date, bodyParts, weeklyLoad) {
    let sd = {};
    bodyParts.forEach(part => {
        const pastWeekLoads = [];
        let currentDate = DateTime.fromISO(date).minus({ days: 6 });

        while (currentDate <= DateTime.fromISO(date)) {
            const dateString = currentDate.toISODate();
            if (dailyLoads[dateString]) {
                pastWeekLoads.push(dailyLoads[dateString][part]);
            }
            currentDate = currentDate.plus({ days: 1 });
        }

        if (pastWeekLoads.length > 0) {
            sd[part] = calculateStandardDeviation(pastWeekLoads);
        } else {
            sd[part] = 0;  // No load data available for the part
        }
    });

    // Calculate the BRI for each body part
    let bri = {};
    bodyParts.forEach(part => {
        bri[part] = sd[part] > 0 ? weeklyLoad[part] / sd[part] : 0;
    });

    return bri;
}

function calculateStandardDeviation(values) {
    const n = values.length;
    const mean = values.reduce((a, b) => a + b) / n;
    return Math.sqrt(values.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n);
}

function fatigue(intensity, duration, daysLater) {
    const decayFactor = 0.1
    const daysToRecovery = Math.pow(5, intensity / 9) - 1;
    return intensity * duration * Math.pow(decayFactor, daysLater / daysToRecovery);
}

function incrementLoads(sessionLoads, loads) {
    sessionLoads.fingers += loads.fingers;
    sessionLoads.upperBody += loads.upperBody;
    sessionLoads.lowerBody += loads.lowerBody;
}

function incrementDailyLoads(dailyLoads, date, loads) {
    if (!dailyLoads[date]) {
        dailyLoads[date] = { fingers: 0, upperBody: 0, lowerBody: 0 };
    }
    incrementLoads(dailyLoads[date], loads);
}

function incrementFatigues(fatigues, date, intensities, durationInHours) {
    for (let daysLater = 1; daysLater <= 14; daysLater++) {
        const fatigueDate = DateTime.fromISO(date).plus({ days: daysLater }).toISODate();
        if (!fatigues[fatigueDate]) {
            fatigues[fatigueDate] = { fingers: 0, upperBody: 0, lowerBody: 0 };
        }
        fatigues[fatigueDate].fingers += fatigue(intensities.fingers, durationInHours, daysLater);
        fatigues[fatigueDate].upperBody += fatigue(intensities.upperBody, durationInHours, daysLater);
        fatigues[fatigueDate].lowerBody += fatigue(intensities.lowerBody, durationInHours, daysLater);
    }
}

module.exports = {
    calculateMetricsForDateRange,
    fatigue,
    incrementDailyLoads,
    incrementFatigues,
    incrementLoads,
}