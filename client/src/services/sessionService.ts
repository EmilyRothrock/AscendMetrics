import { TrainingSession } from "@shared/types";
import { getApiInstance } from "./api";

export const createSession = async (session: TrainingSession) => {
  const api = await getApiInstance();
  const response = await api.post(`/sessions`, session);
  return response.data;
};

export const updateSession = async (session: TrainingSession) => {
  const api = await getApiInstance();
  const response = await api.put(`/sessions/${session.id}`, session);
  return response.data;
};

export const deleteSession = async (sessionId: number) => {
  const api = await getApiInstance();
  await api.delete(`/sessions/${sessionId}`);
};

export const getSessionById = async (sessionId: number) => {
  const api = await getApiInstance();
  const response = await api.get(`/sessions/${sessionId}`);
  return response.data;
};

export const getSessionsForDateRange = async (
  startDate: string,
  endDate: string
) => {
  const api = await getApiInstance();
  const response = await api.get(
    `/sessions?startDate=${startDate}&endDate=${endDate}`
  );
  return response.data;
};
