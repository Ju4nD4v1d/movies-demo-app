import axios from "axios";
import { API_CONFIG, TMDB_CONFIG } from "../env";
import { setupInterceptors } from "./interceptors";

export interface NormalizedError {
  status: number; 
  code: string; 
  message: string; 
  details?: unknown; 
  requestId?: string; 
  url?: string; 
}

export const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
});

setupInterceptors(apiClient, TMDB_CONFIG.token);
