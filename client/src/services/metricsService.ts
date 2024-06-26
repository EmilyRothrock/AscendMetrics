import api from './api';

export const getMetricsWithSessionsForDateRange = async (startDate: string, endDate: string) => {
  const response = await api.get('/metrics', {
    params: { startDate, endDate }
  });
  return response.data;
};

export const getMetricsWithSessionsByDate = async (date: string) => {
  const response = await api.get('/metrics', {
    params: { startDate: date, endDate: date }
  });
  return response.data;
};