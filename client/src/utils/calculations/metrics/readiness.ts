import {
  ReadinessFactors,
  ReadinessWeights,
} from "@shared/types/readinessWeights";

export function weightedMean(
  weights: ReadinessWeights,
  values: Record<ReadinessFactors, number>
): number {
  let totalWeight = 0;
  let weightedSum = 0;

  for (const key in weights) {
    if (values.hasOwnProperty(key)) {
      // Check if the key exists in the values object
      weightedSum += weights[key] * values[key];
      totalWeight += weights[key];
    } else {
      console.warn(`Key '${key}' found in weights but not in values.`);
    }
  }

  if (totalWeight === 0) {
    throw new Error("Total weight cannot be zero.");
  }

  return weightedSum / totalWeight;
}

export function getReadinessWeights(): ReadinessWeights {
  const weights: ReadinessWeights = {
    loadBalance: 1,
    averageLoadSeverity: 1,
    averageWeeklyLoadChange: 1,
    fatigueSeverity: 1,
    strainBalance: 1,
    averageStrainSeverity: 1,
    burnoutRiskIndex: 1,
  };
  return weights;
}
