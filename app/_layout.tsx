import { QUERY_CONFIG } from "@/shared/env";
import {
  focusManager,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: QUERY_CONFIG.retry,

      staleTime: QUERY_CONFIG.staleTime,

      gcTime: QUERY_CONFIG.gcTime,

      refetchOnWindowFocus: true,
    },
  },
});

function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === "active");
}

export default function RootLayout() {
  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: "Movies" }} />
      </Stack>
    </QueryClientProvider>
  );
}
