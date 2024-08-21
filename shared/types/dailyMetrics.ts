import BodyPartMetrics from "./bodyPartMetrics";

interface DailyMetrics {
  dailyLoad: BodyPartMetrics;
  weeklyLoad: BodyPartMetrics;
  monthlyLoad: BodyPartMetrics;
  loadBalance: BodyPartMetrics;
  fatigue: BodyPartMetrics;
  dailyStrain: BodyPartMetrics;
  weeklyStrain: BodyPartMetrics;
  monthlyStrain: BodyPartMetrics;
  strainBalance: BodyPartMetrics;
  weeklyLoadChange: BodyPartMetrics;
  averageWeeklyLoadChange: BodyPartMetrics;
  burnoutRiskIndex: BodyPartMetrics;
  loadSeverity: BodyPartMetrics;
  averageLoadSeverity: BodyPartMetrics;
  strainSeverity: BodyPartMetrics;
  averageStrainSeverity: BodyPartMetrics;
  fatigueSeverity: BodyPartMetrics;
  // averageFatigueSeverity: BodyPartMetrics;
  readiness: BodyPartMetrics;
}

export default DailyMetrics;
