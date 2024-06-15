import { MetricsTable } from "./metricsTable";
import { Session } from "./session";

export interface UserDataBundle {
    sessions: Session[];
    fingerMetrics: MetricsTable;
    upperMetrics: MetricsTable;
    lowerMetrics: MetricsTable;
}