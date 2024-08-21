export function quarticNormalization(domain: number, value: number) {
  let result = 0;

  if (value > 0 && value < domain) {
    result = value ** 2 * (value - domain) ** 2;
  }

  return result;
}

export function severityNormalization(domain: number, value: number) {
  let result = 0;
  const skewFactor = 27 / 500;

  if (value > 0 && value < domain) {
    result = skewFactor * (value - 5) ** 2 * value;
  }

  return result;
}

export function strainNormalization(domain: number, value: number) {
  let result = 0;

  if (value > 0 && value < 1) {
    result = 1;
  } else if (value < 2) {
    result = quarticNormalization(domain, value);
  }

  return result;
}

export function inverseCubicNormalization(domain: number, value: number) {
  let result = 0;

  if (value > 0 && value < domain) {
    result = 1 - (value / domain) ** 3;
  }

  return result;
}

export function inverseQuarticNormalization(domain: number, value: number) {
  let result = 0;

  if (value > 0 && value < domain) {
    result = 1 - (value / domain) ** 4;
  }

  return result;
}
