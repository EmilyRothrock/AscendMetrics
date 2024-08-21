import { incrementDailyLoads } from "./metrics/dailyLoad";
import { incrementFatigues } from "./metrics/fatigue";
import { DateTime } from "luxon";
import { getReadinessWeights, weightedMean } from "./metrics/readiness";
import {
  inverseCubicNormalization,
  inverseQuarticNormalization,
  quarticNormalization,
  severityNormalization,
  strainNormalization,
} from "./normalizations";
import { calculateBurnoutRiskIndex } from "./metrics/burnoutRiskIndex";
import {
  BodyPart,
  MetricByDate,
  MetricsTable,
  TrainingSession,
} from "@shared/types";
import BODY_PARTS from "@shared/types/BODYPARTS";

export function calculateMetricsForDateRange(
  startDate: string,
  endDate: string,
  sessions: TrainingSession[]
): MetricsTable {
  // Calculations related to sessions - stats, daily loads, fatigues
  const readinessWeights = getReadinessWeights();

  const dailyLoads: MetricByDate = {};
  const fatigues: MetricByDate = {};
  for (const session of sessions) {
    session.sessionActivities.forEach((sessionActivity) => {
      const date = DateTime.fromISO(session.completedOn);

      if (!date.isValid) {
        throw new Error("invalid date");
      }
      const dateString = date.toISODate();
      incrementDailyLoads(dailyLoads, dateString, sessionActivity.loads);
      incrementFatigues(
        fatigues,
        dateString,
        sessionActivity.intensities,
        sessionActivity.duration / 60
      );
    });
  }

  // Calculations derived from daily loads and fatigues
  const alpha7 = 2 / 8; // 7+1 for smoothing
  const alpha28 = 2 / 29; // 28+1 for smoothing

  const earlyStart = DateTime.fromISO(startDate).minus({ days: 28 });
  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);
  if (!start.isValid || !end.isValid || !earlyStart.isValid) {
    throw new Error("invalid date");
  }

  let metricsTable: MetricsTable = {};
  let EWMA = {
    WL: {} as MetricByDate,
    ML: {} as MetricByDate,
    WLS: {} as MetricByDate,
    WLChange: {} as MetricByDate,
    WS: {} as MetricByDate,
    MS: {} as MetricByDate,
    WSS: {} as MetricByDate,
  };

  // TODO: Setting values for early start (calibration values)

  for (
    let currentDate = earlyStart;
    currentDate <= end;
    currentDate = currentDate.plus({ days: 1 })
  ) {
    const dateString = currentDate.toISODate();
    const yesterdayDateString = currentDate.minus({ days: 1 }).toISODate();
    const lastWeekDateString = currentDate.minus({ days: 7 }).toISODate();

    // Initializations
    EWMA.WL[dateString] = { fingers: 0, upperBody: 0, lowerBody: 0 };
    EWMA.ML[dateString] = { fingers: 0, upperBody: 0, lowerBody: 0 };
    const loadBalance = { fingers: 0, upperBody: 0, lowerBody: 0 };
    const loadSeverity = { fingers: 0, upperBody: 0, lowerBody: 0 };
    EWMA.WLS[dateString] = { fingers: 0, upperBody: 0, lowerBody: 0 };
    const weeklyLoadChange = { fingers: 0, upperBody: 0, lowerBody: 0 };
    EWMA.WLChange[dateString] = { fingers: 0, upperBody: 0, lowerBody: 0 };
    const dailyStrain = { fingers: 0, upperBody: 0, lowerBody: 0 };
    EWMA.WS[dateString] = { fingers: 0, upperBody: 0, lowerBody: 0 };
    EWMA.MS[dateString] = { fingers: 0, upperBody: 0, lowerBody: 0 };
    const strainBalance = { fingers: 0, upperBody: 0, lowerBody: 0 };
    const strainSeverity = { fingers: 0, upperBody: 0, lowerBody: 0 };
    const fatigueSeverity = { fingers: 0, upperBody: 0, lowerBody: 0 };
    EWMA.WSS[dateString] = { fingers: 0, upperBody: 0, lowerBody: 0 };
    const readiness = { fingers: 0, upperBody: 0, lowerBody: 0 };

    // Calculations
    BODY_PARTS.forEach((part) => {
      EWMA.WL[dateString][part] = updateEWMA(
        alpha7,
        getMetricValue(dailyLoads, yesterdayDateString, part),
        getMetricValue(EWMA.WL, yesterdayDateString, part)
      );
      EWMA.ML[dateString][part] = updateEWMA(
        alpha28,
        getMetricValue(dailyLoads, yesterdayDateString, part),
        getMetricValue(EWMA.ML, yesterdayDateString, part)
      );
      dailyStrain[part] = Math.sqrt(
        getMetricValue(dailyLoads, dateString, part) *
          getMetricValue(fatigues, dateString, part)
      );
      EWMA.WS[dateString][part] = updateEWMA(
        alpha7,
        dailyStrain[part],
        getMetricValue(EWMA.WS, yesterdayDateString, part)
      );
      EWMA.MS[dateString][part] = updateEWMA(
        alpha28,
        dailyStrain[part],
        getMetricValue(EWMA.MS, yesterdayDateString, part)
      );
    });

    if (currentDate >= start.minus({ days: 7 })) {
      BODY_PARTS.forEach((part) => {
        loadSeverity[part] =
          getMetricValue(dailyLoads, dateString, part) /
          getMetricValue(EWMA.ML, dateString, part);
        weeklyLoadChange[part] =
          getMetricValue(EWMA.WL, dateString, part) /
          getMetricValue(EWMA.WL, lastWeekDateString, part);
        strainSeverity[part] =
          dailyStrain[part] / getMetricValue(EWMA.MS, dateString, part);
        // Update corresponding EWMAs
        EWMA.WLS[dateString][part] = updateEWMA(
          alpha7,
          loadSeverity[part],
          getMetricValue(EWMA.WLS, yesterdayDateString, part)
        );
        EWMA.WLChange[dateString][part] = updateEWMA(
          alpha7,
          weeklyLoadChange[part],
          getMetricValue(EWMA.WLChange, yesterdayDateString, part)
        );
        EWMA.WSS[dateString][part] = updateEWMA(
          alpha7,
          strainSeverity[part],
          getMetricValue(EWMA.WSS, yesterdayDateString, part)
        );
      });
    }

    if (currentDate >= start) {
      BODY_PARTS.forEach((part) => {
        loadBalance[part] =
          getMetricValue(EWMA.WL, dateString, part) /
          getMetricValue(EWMA.ML, dateString, part);
        strainBalance[part] =
          getMetricValue(EWMA.WS, dateString, part) /
          getMetricValue(EWMA.MS, dateString, part);
        fatigueSeverity[part] =
          getMetricValue(fatigues, dateString, part) /
          getMetricValue(EWMA.MS, dateString, part);
      });

      const burnoutRiskIndex = calculateBurnoutRiskIndex(
        dailyLoads,
        metricsTable,
        dateString,
        EWMA.WL[dateString]
      );

      BODY_PARTS.forEach((part) => {
        const normalizedValues = {
          loadBalance: quarticNormalization(2, loadBalance[part]),
          averageLoadSeverity: severityNormalization(
            5,
            EWMA.WLS[dateString][part]
          ),
          averageWeeklyLoadChange: quarticNormalization(
            2,
            EWMA.WLChange[dateString][part]
          ),
          fatigueSeverity: inverseCubicNormalization(5, fatigueSeverity[part]),
          strainBalance: strainNormalization(2, strainBalance[part]),
          averageStrainSeverity: inverseCubicNormalization(
            4,
            EWMA.WSS[dateString][part]
          ),
          burnoutRiskIndex: inverseQuarticNormalization(
            2.5,
            burnoutRiskIndex[part]
          ),
        };

        readiness[part] = weightedMean(readinessWeights, normalizedValues);
      });

      // Assignments
      metricsTable[dateString] = {
        dailyLoad: dailyLoads[dateString] || {
          fingers: 0,
          upperBody: 0,
          lowerBody: 0,
        },
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

function getMetricValue(metrics: MetricByDate, date: string, part: BodyPart) {
  return metrics[date]?.[part] ?? 0;
}
