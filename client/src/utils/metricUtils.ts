import { DateTime } from "luxon";
import { MetricsTable } from "../types";
import { DateRange } from "../types/dateRange";
import { RootState } from "../store/store";

export function updateMetricsTable(
  existingMetrics: MetricsTable,
  newMetrics: MetricsTable
): MetricsTable {
  const mergedMetrics: MetricsTable = { ...existingMetrics };
  for (const [date, metrics] of Object.entries(newMetrics)) {
    mergedMetrics[date] = metrics;
  }
  return mergedMetrics;
}

export function updateLoadedRange(
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

export function isRangeLoaded(
  state: RootState,
  startDate: string,
  endDate: string
): boolean {
  const loadedRange = state.metrics.loadedRange;

  if (!loadedRange || !loadedRange.startDate || !loadedRange.endDate) {
    return false;
  }

  const start = DateTime.fromISO(startDate);
  const end = DateTime.fromISO(endDate);
  const rangeStart = DateTime.fromISO(loadedRange.startDate);
  const rangeEnd = DateTime.fromISO(loadedRange.endDate);

  return rangeStart <= start && rangeEnd >= end;
}
