export interface MetricsTable {
    [date: string]: DailyMetrics,
}

export interface DailyMetrics {
    dailyLoad: number;
    weeklyLoad: number;
    monthlyLoad: number;
    loadRatio: number;
    fatigue: number;
    dailyStrain: number;
    weeklyStrain: number;
    monthlyStrain: number;
    strainRatio: number;
    readiness: number;
}