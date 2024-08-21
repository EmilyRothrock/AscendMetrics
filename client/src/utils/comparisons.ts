import { BodyPartMetrics } from "@shared/types";
import { FieldName } from "../types/fieldOptions";

export const fieldComparer = (selecteField: FieldName) => {
  switch (selecteField) {
    case "name":
      return compareStrings;
    case "notes":
      return compareStrings;
    case "activities":
      return compareStrings;
    case "completedOn":
      return compareDates;
    case "loads":
      return compareMetricAverage;
    case "duration":
      return compareNumbers;
  }
};

/**
 * Compares two strings for sorting.
 *
 * @param {string} a - The first string to compare.
 * @param {string} b - The second string to compare.
 * @param {boolean} sortAscending - If true, sorts in ascending order; if false, sorts in descending order.
 * @returns {number} - Returns a negative value if `a` should come before `b`, a positive value if `a` should come after `b`, or 0 if they are equivalent.
 */
export const compareStrings = (a: string, b: string, sortAscending = true) => {
  if (a && b) {
    if (sortAscending) {
      return a.localeCompare(b);
    } else {
      return b.localeCompare(a);
    }
  } else if (!a) {
    return 1;
  } else return -1;
};

export const compareNumbers = (a: number, b: number, sortAscending = true) => {
  if (a && b) {
    if (sortAscending) {
      return a - b;
    } else {
      return b - a;
    }
  } else if (!a) {
    return 1;
  } else return -1;
};

/**
 * Compares two dates in ISO format for sorting.
 *
 * @param {string | Date} a - The first date to compare. Can be a Date object or an ISO date string.
 * @param {string | Date} b - The second date to compare. Can be a Date object or an ISO date string.
 * @param {boolean} sortAscending - If true, sorts in ascending order; if false, sorts in descending order.
 * @returns {number} - Returns a negative value if `a` should come before `b`, a positive value if `a` should come after `b`, or 0 if they are equivalent.
 */
export const compareDates = (
  a: string | Date,
  b: string | Date,
  sortAscending: boolean = false
): number => {
  // Convert ISO date strings to Date objects if necessary
  const dateA = typeof a === "string" ? new Date(a) : a;
  const dateB = typeof b === "string" ? new Date(b) : b;

  // Compare timestamps
  const comparison = dateA.getTime() - dateB.getTime();
  return sortAscending ? comparison : -comparison;
};

export const compareMetricAverage = (
  a: BodyPartMetrics,
  b: BodyPartMetrics,
  sortAscending: boolean = false
): number => {
  const avgA = metricAverage(a);
  const avgB = metricAverage(b);

  if (sortAscending) {
    return avgA - avgB;
  } else {
    return avgB - avgA;
  }
};

function metricAverage(metric: BodyPartMetrics) {
  return (metric.fingers + metric.upperBody + metric.lowerBody) / 3;
}
