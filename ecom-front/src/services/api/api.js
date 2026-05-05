import axios from "axios";

const backendUrl = import.meta.env.VITE_BACK_END_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: `${backendUrl}/api`,
  withCredentials: true, 
});

export default api;
