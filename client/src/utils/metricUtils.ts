import { DateTime } from "luxon";
import { MetricsTable, TrainingSession } from "@shared/types";
import { DateRange } from "../types/dateRange";
import { calculateMetricsForDateRange } from "./calculations/metricsTableCalcs";

/**
 * Merges the existing metrics table with the new metrics.
 */
export function mergeMetricsTable(
  existingMetrics: MetricsTable,
  newMetrics: MetricsTable
): MetricsTable {
  const mergedMetrics: MetricsTable = { ...existingMetrics };
  for (const [date, metrics] of Object.entries(newMetrics)) {
    mergedMetrics[date] = metrics;
  }
  return mergedMetrics;
}

/**
 * Updates the loaded range by taking the minimum of startDate
 * and the maximum of endDate between the existing and new ranges.
 */
export function mergeRanges(
  existingRange: DateRange | null,
  newRange: DateRange
): DateRange {
  const existingStart = existingRange
    ? DateTime.fromISO(existingRange.startDate)
    : DateTime.fromISO(newRange.startDate);
  const existingEnd = existingRange
    ? DateTime.fromISO(existingRange.endDate)
    : DateTime.fromISO(newRange.endDate);

  const minStartDate = DateTime.min(
    existingStart,
    DateTime.fromISO(newRange.startDate)
  ).toISODate();
  const maxEndDate = DateTime.max(
    existingEnd,
    DateTime.fromISO(newRange.endDate)
  ).toISODate();

  return {
    startDate: minStartDate || newRange.startDate,
    endDate: maxEndDate || newRange.endDate,
  };
}

export function getDependencyDateRange(
  depDate: string | null
): [string | null, string | null] {
  if (!depDate) {
    console.error("Invalid date: depDate is null or undefined.");
    return [null, null];
  }

  const startDate = DateTime.fromISO(depDate);
  if (!startDate.isValid) {
    console.error(`Invalid date format: ${depDate}`);
    return [null, null];
  }

  const endDate = startDate.plus({ months: 2 });
  return [startDate.toISODate(), endDate.toISODate()];
}

export function updateDependentMetricsForDateRange(
  depRange: string[],
  sessions: Record<number, TrainingSession>
): MetricsTable {
  const filterCon = (session: TrainingSession) => {
    const completedOnLux = DateTime.fromISO(session.completedOn);
    const startLux = DateTime.fromISO(depRange[0]);
    const endLux = DateTime.fromISO(depRange[1]);

    // Ensure all dates are valid before comparing
    if (!completedOnLux.isValid || !startLux.isValid || !endLux.isValid) {
      console.warn("Invalid date encountered in session filtering");
      return false;
    }

    return (
      completedOnLux.toMillis() > startLux.minus({ months: 1 }).toMillis() &&
      completedOnLux.toMillis() < endLux.toMillis()
    );
  };

  const filteredSessions = Object.values(sessions).filter(filterCon);
  return calculateMetricsForDateRange(
    depRange[0],
    depRange[1],
    filteredSessions
  );
}
