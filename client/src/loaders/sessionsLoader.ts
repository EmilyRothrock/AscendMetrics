import { fetchSessionById, selectSessionById } from "../store/sessionsSlice";
import store from "../store/store";
import { LoaderFunctionArgs } from "react-router-dom";

interface SessionLoaderParams {
  params: {
    id: string;
  };
}

export const sessionLoader = async ({
  params,
}: LoaderFunctionArgs<SessionLoaderParams["params"]>) => {
  const { id } = params;

  if (id === "new") return null;

  const sessionId = Number(id);
  const session = selectSessionById(store.getState(), sessionId);

  if (!session) {
    await store.dispatch(fetchSessionById(sessionId));
  }

  return null;
};
