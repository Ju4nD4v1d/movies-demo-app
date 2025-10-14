import Constants from "expo-constants";

function getEnvVar(key: string, fallback: string): string {
  return Constants.expoConfig?.extra?.[key] || process.env[key] || fallback;
}

function getEnvNumber(key: string, fallback: number): number {
  const value = getEnvVar(key, String(fallback));
  const parsed = Number(value);
  return isNaN(parsed) ? fallback : parsed;
}

export const TMDB_CONFIG = {
  token: getEnvVar(
    "EXPO_PUBLIC_TMDB_TOKEN",
    "" 
  ),
};

export const API_CONFIG = {
  baseURL: getEnvVar(
    "EXPO_PUBLIC_API_BASE_URL",
    "https://api.themoviedb.org/3"
  ),
  timeout: getEnvNumber("EXPO_PUBLIC_API_TIMEOUT", 15000),
};

export const QUERY_CONFIG = {
  staleTime: getEnvNumber("EXPO_PUBLIC_QUERY_STALE_TIME", 30_000), 
  gcTime: getEnvNumber("EXPO_PUBLIC_QUERY_GC_TIME", 300_000), 
  retry: getEnvNumber("EXPO_PUBLIC_QUERY_RETRY_COUNT", 2),
};
