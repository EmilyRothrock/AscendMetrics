import { Session } from "../types";
import api from "./api";

export const createSession = async (session: Session) => {
    const response = await api.post(`/sessions`, session);
    return response.data;
};

export const updateSession = async (session: Session) => {
    const response = await api.put(`/sessions/${session.id}`, session);
    return response.data;
};

export const deleteSession = async (sessionId: number) => {
    await api.delete(`/sessions/${sessionId}`);
};

export const getSessionById = async (sessionId: number) => {
    const response = await api.get(`/sessions/${sessionId}`);
    return response.data;
};

export const getSessionsForDateRange = async (startDate: string, endDate: string) => {
    const response = await api.get(`/sessions?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
};