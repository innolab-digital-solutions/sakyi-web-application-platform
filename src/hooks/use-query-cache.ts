"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

/**
 * Centralized query cache manager hook
 *
 * Provides a unified interface for managing TanStack Query cache operations:
 * - Query invalidation to trigger refetch
 * - Cache removal and cleanup
 * - Direct cache data manipulation
 * - Query prefetching
 * - Bulk cache operations
 *
 * @returns Query management functions and raw query client
 */
export const useQueryCache = () => {
  const queryClient = useQueryClient();

  /**
   * Invalidate queries to trigger a refetch
   *
   * Accepts multiple formats for flexibility in different use cases.
   *
   * @param queryKey - Query key, array, or filter object
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
   * Remove queries from cache permanently
   *
   * @param queryKey - Query key, array, or filter object
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
   * Useful for optimistic updates or manual cache manipulation.
   *
   * @param queryKey - Query key array
   * @param data - Data to store in cache
   */
  const setQueryData = useCallback(
    <T>(
      queryKey: string[] | string,
      dataOrUpdater: T | ((previousData: T | undefined) => T),
      options?: { all?: boolean },
    ) => {
      const normalizedKey = typeof queryKey === "string" ? [queryKey] : queryKey;
      if (options?.all) {
        queryClient.setQueriesData<T>({ queryKey: normalizedKey }, dataOrUpdater as T);
        return;
      }
      queryClient.setQueryData<T>(normalizedKey, dataOrUpdater as T);
    },
    [queryClient],
  );

  /**
   * Retrieve query data from cache
   *
   * @param queryKey - Query key array
   * @returns Cached data or undefined
   */
  const getQueryData = useCallback(
    <T>(queryKey: string[]) => {
      return queryClient.getQueryData<T>(queryKey);
    },
    [queryClient],
  );

  /**
   * Prefetch query data before it's needed
   *
   * Useful for improving perceived performance by loading data in advance.
   *
   * @param queryKey - Query key array
   * @param queryFunction - Async function to fetch data
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
   * Invalidate multiple query patterns in one call
   *
   * @param patterns - Array of query keys or key arrays
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
   * Clear all cached queries
   *
   * Use with caution as this removes all data from the cache.
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
