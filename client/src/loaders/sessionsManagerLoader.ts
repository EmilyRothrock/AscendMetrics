import { DateTime } from "luxon";
import { fetchMetricsWithSessionsForDateRange } from "../store/metricsSlice";
import store from "../store/store";
import { isRangeLoaded } from "../utils/metricUtils";

// TODO: check for at least past month of sessions and fetch if you don't have them
export const sessionsManagerLoader = async () => {
  const endDate = DateTime.now().toISODate();
  const startDate = DateTime.now().minus({ months: 1 }).toISODate();

  // TODO: fetch only missing range?
  if (!isRangeLoaded(store.getState(), startDate, endDate)) {
    await store.dispatch(
      fetchMetricsWithSessionsForDateRange({
        startDate,
        endDate,
      })
    );
  }

  return null;
};
