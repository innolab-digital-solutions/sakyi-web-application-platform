"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import React from "react";

interface QueryProviderProperties {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProperties) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Stale time - how long data is considered fresh
        staleTime: 5 * 60 * 1000, // 5 minutes
        // Cache time - how long inactive data stays in cache
        gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
        // Retry failed requests
        retry: (failureCount, error: unknown) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.status >= 400 && error?.status < 500) {
            return false;
          }
          // Retry up to 3 times for other errors
          return failureCount < 3;
        },
        // Refetch on window focus for important data
        refetchOnWindowFocus: false,
        // Don't refetch on reconnect by default
        refetchOnReconnect: true,
      },
      mutations: {
        // Global mutation settings
        retry: 1,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
