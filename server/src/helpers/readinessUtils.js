function weightedMean(weights, values) {
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

function getReadinessWeights() {
  const weights = {
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

// Normalizations

function quarticNormalization(domain, value) {
  let result = 0;

  if (value > 0 && value < domain) {
    result = value ** 2 * (value - domain) ** 2;
  }

  return result;
}

function severityNormalization(domain, value) {
  let result = 0;
  const skewFactor = 27 / 500;

  if (value > 0 && value < domain) {
    result = skewFactor * (value - 5) ** 2 * value;
  }

  return result;
}

function strainNormalization(domain, value) {
  let result = 0;

  if (value > 0 && value < 1) {
    result = 1;
  } else if (value < 2) {
    result = quarticNormalization(domain, value);
  }

  return result;
}

function inverseCubicNormalization(domain, value) {
  let result = 0;

  if (value > 0 && value < domain) {
    result = 1 - (value / domain) ** 3;
  }

  return result;
}

function inverseQuarticNormalization(domain, value) {
  let result = 0;

  if (value > 0 && value < domain) {
    result = 1 - (value / domain) ** 4;
  }

  return result;
}

export {
  weightedMean,
  getReadinessWeights,
  quarticNormalization,
  severityNormalization,
  strainNormalization,
  inverseCubicNormalization,
  inverseQuarticNormalization,
};
