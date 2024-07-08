import { fetchSessionById, selectSessionById } from '../store/sessionsSlice';
import store from '../store/store';
import { LoaderFunctionArgs } from 'react-router-dom';

interface SessionLoaderParams {
  params: {
    id: string;
  };
  }

export const sessionLoader = async ({ params } : LoaderFunctionArgs<SessionLoaderParams['params']>) => {
  if (!params.id) {
    throw new Error('Session ID is required');
  }

  const sessionId = Number(params.id);

  const session = selectSessionById(store.getState(), sessionId);

  if (!session) {
    await store.dispatch(fetchSessionById(sessionId));
  }

  return null;
};
