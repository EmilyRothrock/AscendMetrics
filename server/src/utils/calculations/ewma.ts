/**
 * Updates the Exponentially Weighted Moving Average (EWMA) for a given value.
 */
function updateEWMA(alpha: number, value: number, previousEWMA: number) {
  return alpha * value + (1 - alpha) * previousEWMA;
}
