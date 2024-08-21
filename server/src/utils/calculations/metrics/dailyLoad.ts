import BodyPartMetrics from "@shared/types/bodyPartMetrics";
import { incrementLoads } from "../loadCalcs";

export function incrementDailyLoads(
  dailyLoads: {
    [date: string]: BodyPartMetrics;
  },
  date: string,
  loads: BodyPartMetrics
) {
  if (!dailyLoads[date]) {
    dailyLoads[date] = { fingers: 0, upperBody: 0, lowerBody: 0 };
  }
  incrementLoads(dailyLoads[date], loads);
}
