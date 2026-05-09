import axios from "axios";
import { getStoredAuthToken } from "../../shared/utils/authStorage";

const backendUrl = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${backendUrl}/api`,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getStoredAuthToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
