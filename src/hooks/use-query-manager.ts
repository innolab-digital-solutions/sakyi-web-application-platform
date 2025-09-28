"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Centralized query manager for easy cache invalidation and management
 * Provides a clean API for managing TanStack Query cache across the application
 */
export const useQueryManager = () => {
  const queryClient = useQueryClient();

  /**
   * Invalidate queries by key pattern
   *
   * @param queryKey - Query key or pattern to invalidate
   */
  const invalidateQueries = useCallback(
    (queryKey: string | string[] | { queryKey: string[] }) => {
      if (typeof queryKey === "string") {
        queryClient.invalidateQueries({ queryKey: [queryKey] });
      } else if (Array.isArray(queryKey)) {
        queryClient.invalidateQueries({ queryKey });
      } else {
        queryClient.invalidateQueries(queryKey);
      }
    },
    [queryClient],
  );

  /**
   * Remove queries from cache
   *
   * @param queryKey - Query key or pattern to remove
   */
  const removeQueries = useCallback(
    (queryKey: string | string[] | { queryKey: string[] }) => {
      if (typeof queryKey === "string") {
        queryClient.removeQueries({ queryKey: [queryKey] });
      } else if (Array.isArray(queryKey)) {
        queryClient.removeQueries({ queryKey });
      } else {
        queryClient.removeQueries(queryKey);
      }
    },
    [queryClient],
  );

  /**
   * Set query data directly in cache
   *
   * @param queryKey - Query key to set data for
   * @param data - Data to set
   */
  const setQueryData = useCallback(
    <T>(queryKey: string[], data: T) => {
      queryClient.setQueryData(queryKey, data);
    },
    [queryClient],
  );

  // eslint-disable-next-line no-commented-code/no-commented-code
  /**
   * Get query data from cache
   *
   * @param queryKey - Query key to get data for
   */
  const getQueryData = useCallback(
    <T>(queryKey: string[]) => {
      return queryClient.getQueryData<T>(queryKey);
    },
    [queryClient],
  );

  /**
   * Prefetch query data
   *
   * @param queryKey - Query key to prefetch
   * @param queryFunction - Function to fetch data
   */
  const prefetchQuery = useCallback(
    async <T>(queryKey: string[], queryFunction: () => Promise<T>) => {
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: queryFunction,
      });
    },
    [queryClient],
  );

  /**
   * Invalidate multiple query patterns at once
   *
   * @param patterns - Array of query key patterns
   */
  const invalidateMultiple = useCallback(
    (patterns: (string | string[])[]) => {
      for (const pattern of patterns) {
        if (typeof pattern === "string") {
          queryClient.invalidateQueries({ queryKey: [pattern] });
        } else {
          queryClient.invalidateQueries({ queryKey: pattern });
        }
      }
    },
    [queryClient],
  );

  /**
   * Clear all queries from cache
   */
  const clearAll = useCallback(() => {
    queryClient.clear();
  }, [queryClient]);

  return {
    invalidateQueries,
    removeQueries,
    setQueryData,
    getQueryData,
    prefetchQuery,
    invalidateMultiple,
    clearAll,
    queryClient, // Expose raw client for advanced usage
  };
};
