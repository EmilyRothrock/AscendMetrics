export type ReadinessWeights = Record<ReadinessFactors, number>;

export type ReadinessFactors =
  | "loadBalance"
  | "averageLoadSeverity"
  | "averageWeeklyLoadChange"
  | "fatigueSeverity"
  | "strainBalance"
  | "averageStrainSeverity"
  | "burnoutRiskIndex";
