import axios from "axios";
import { API_BASE } from "./config";

export const api = axios.create({
  baseURL: API_BASE ? `${API_BASE}/api` : "/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default api;
