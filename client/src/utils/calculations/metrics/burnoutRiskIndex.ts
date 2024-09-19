import BodyPart from "@shared/types/bodyPart";
import BodyPartMetrics from "@shared/types/bodyPartMetrics";
import MetricsTable from "@shared/types/metricsTable";
import { DateTime } from "luxon";

export function calculateBurnoutRiskIndex(
  dailyLoads: {
    [date: string]: BodyPartMetrics;
  },
  _metricsTable: MetricsTable,
  date: string,
  weeklyLoad: BodyPartMetrics
) {
  let stDev: BodyPartMetrics = { fingers: 0, upperBody: 0, lowerBody: 0 };
  Object.values(BodyPart).forEach((part) => {
    const pastWeekLoads = [];
    let currentDate = DateTime.fromISO(date).minus({ days: 6 });

    while (currentDate.isValid && currentDate <= DateTime.fromISO(date)) {
      const dateString = currentDate.toISODate();
      if (dailyLoads[dateString]) {
        pastWeekLoads.push(dailyLoads[dateString][part]);
      }
      currentDate = currentDate.plus({ days: 1 });
    }

    if (pastWeekLoads.length > 0) {
      stDev[part] = calculateStandardDeviation(pastWeekLoads);
    } else {
      stDev[part] = 0; // No load data available for the part
    }
  });

  // Calculate the BRI for each body part
  let result: BodyPartMetrics = { fingers: 0, upperBody: 0, lowerBody: 0 };
  Object.values(BodyPart).forEach((part) => {
    result[part] = stDev[part] > 0 ? weeklyLoad[part] / stDev[part] : 0;
  });

  return result;
}

function calculateStandardDeviation(values: number[]) {
  const n = values.length;
  const mean = values.reduce((a, b) => a + b) / n;
  return Math.sqrt(
    values.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  );
}
