import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";

// Utility function to get the API instance
export const getApiInstance = async () => {
  const { getAccessTokenSilently } = useAuth0();

  const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
  });

  // Request interceptor to include the JWT in the Authorization header
  api.interceptors.request.use(async (config) => {
    const token = await getAccessTokenSilently();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return api;
};
