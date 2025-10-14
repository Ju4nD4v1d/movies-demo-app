import { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import Constants from "expo-constants";
import { NormalizedError } from "./api";


function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function setupRequestInterceptor(
  axiosInstance: AxiosInstance,
  token: string
) {
  axiosInstance.interceptors.request.use(
    (config) => {
    
      const requestId = generateUUID();

      config.headers = config.headers || {};

      config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
      config.headers["Pragma"] = "no-cache";
      config.headers["Expires"] = "0";

      config.headers["Accept"] = "application/json";
      config.headers["Content-Type"] = "application/json";

      config.headers["Authorization"] = `Bearer ${token}`;

      config.headers["X-Request-Id"] = requestId; 
      config.headers["X-App-Version"] = Constants.expoConfig?.version || "1.0.0";
      config.headers["X-Platform"] = Constants.platform?.ios
        ? "ios"
        : Constants.platform?.android
          ? "android"
          : "web";

      return config;
    },
    (error) => {
      console.error("[HTTP] Request setup failed:", error.message);
      return Promise.reject(error);
    }
  );
}

function setupResponseInterceptor(axiosInstance: AxiosInstance) {
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error: AxiosError) => {
    
      const requestId = error.config?.headers?.["X-Request-Id"];

      console.error("[HTTP] Request failed:", {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        requestId,
      });

      const normalizedError: NormalizedError = {
        status: error.response?.status || 0,
        code: error.code || "UNKNOWN_ERROR",
        message:
          error.message ||
          (error.response?.data as { status_message?: string })
            ?.status_message ||
          "An unknown error occurred",
        details: error.response?.data, 
        requestId: requestId as string | undefined,
        url: error.config?.url,
      };

      return Promise.reject(normalizedError);
    }
  );
}

export function setupInterceptors(
  axiosInstance: AxiosInstance,
  token: string
) {
  setupRequestInterceptor(axiosInstance, token);
  setupResponseInterceptor(axiosInstance);
}
