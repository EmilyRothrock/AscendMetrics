import {
  fetchSessionById,
  selectSessionById,
} from "../store/sessionMetricsSlice";
import store from "../store/store";

export const sessionLoader = async (id: string) => {
  if (id === "new") return null;

  const sessionId = Number(id);
  const session = selectSessionById(store.getState(), sessionId);

  if (!session) {
    await store.dispatch(fetchSessionById(sessionId));
  }

  return null;
};
