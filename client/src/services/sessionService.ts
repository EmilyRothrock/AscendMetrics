import { Session } from "../types";
import api from "./api";

export const createSession = async (session: Session) => {
    const response = await api.post(`/sessions`, session);
    return response.data;
};

export const updateSession = async (sessionId: number, session: Session) => {
    const response = await api.put(`/sessions/${sessionId}`, session);
    return response.data;
};

export const deleteSession = async (sessionId: number) => {
    await api.delete(`/sessions/${sessionId}`);
};