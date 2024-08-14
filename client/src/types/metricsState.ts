import { SerializedError } from "@reduxjs/toolkit";
import { DateRange } from "./dateRange";
import { MetricsTable } from "./metricsTable";

export interface MetricsState {
  metricsTable: MetricsTable;
  loadedRange: DateRange | null;
  loading: boolean;
  error: SerializedError | null;
}
