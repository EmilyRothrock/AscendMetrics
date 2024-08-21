import DailyMetrics from "./dailyMetrics";

interface MetricsTable {
  [date: string]: DailyMetrics;
}

export default MetricsTable;
