"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { http } from "@/lib/api/client";
import { Pagination } from "@/types/shared/common";
import { ListQueryParameters, SortDirection } from "@/types/shared/parameters";
import { getStoredToken } from "@/utils/auth/storage";
import {
  DEFAULT_LIST_PARAMS,
  mergeParameters,
  parseListParameters,
  serializeParameters,
} from "@/utils/shared/parameters";

interface UseTableConfig {
  endpoint: string;
  queryKey: string[];
  searchKeys?: string[];
  defaultSort?: { field: string; direction: "asc" | "desc" };
}

/**
 * Custom hook for managing server-side table operations including pagination, sorting, searching, and URL synchronization.
 *
 * @template T - The type of data items in the table
 * @param config - Configuration object for the server table
 * @param config.endpoint - API endpoint for fetching table data
 * @param config.queryKey - React Query cache key for the data
 * @param config.searchKeys - Array of field names that can be searched (optional)
 * @param config.defaultSort - Default sorting configuration (optional)
 * @returns Object containing table data, loading state, and configuration objects for search, pagination, sorting, and server operations
 */
export function useTable<T>({ endpoint, queryKey, searchKeys = [], defaultSort }: UseTableConfig) {
  const { token } = getStoredToken();
  const searchParameters = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Parse URL parameters - this will update when URL changes
  const urlParameters = useMemo(
    () => parseListParameters(searchParameters, DEFAULT_LIST_PARAMS),
    [searchParameters],
  );

  // Internal state for table operations
  const [pageIndex, setPageIndex] = useState(Math.max(0, (urlParameters.page ?? 1) - 1));
  const [pageSize, setPageSize] = useState(urlParameters.per_page ?? DEFAULT_LIST_PARAMS.per_page);
  const [search, setSearch] = useState(urlParameters.search ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Initialize sorting state from URL parameters or default configuration
  const [sorting, setSorting] = useState<SortingState>(
    urlParameters.sort
      ? [
          {
            id: String(urlParameters.sort),
            desc: (urlParameters.direction ?? DEFAULT_LIST_PARAMS.direction) === "desc",
          },
        ]
      : defaultSort
        ? [
            {
              id: defaultSort.field,
              desc: defaultSort.direction === "desc",
            },
          ]
        : [],
  );

  // Sync internal state when URL changes externally (e.g., from form resets)
  // Only update if values actually differ to prevent infinite loops
  useEffect(() => {
    const newPageIndex = Math.max(0, (urlParameters.page ?? 1) - 1);
    const newPageSize = urlParameters.per_page ?? DEFAULT_LIST_PARAMS.per_page;
    const newSearch = urlParameters.search ?? "";

    if (pageIndex !== newPageIndex) {
      setPageIndex(newPageIndex);
    }
    if (pageSize !== newPageSize) {
      setPageSize(newPageSize);
    }
    if (search !== newSearch) {
      setSearch(newSearch);
    }

    // Update sorting if it changed in URL
    const currentSortId = sorting[0]?.id;
    const currentSortDesc = sorting[0]?.desc;
    const urlSortId = urlParameters.sort ? String(urlParameters.sort) : defaultSort?.field;
    const urlSortDesc = urlParameters.sort
      ? (urlParameters.direction ?? DEFAULT_LIST_PARAMS.direction) === "desc"
      : defaultSort?.direction === "desc";

    // Only update sorting if it actually changed
    if (currentSortId !== urlSortId || currentSortDesc !== urlSortDesc) {
      if (urlParameters.sort) {
        setSorting([
          {
            id: String(urlParameters.sort),
            desc: (urlParameters.direction ?? DEFAULT_LIST_PARAMS.direction) === "desc",
          },
        ]);
      } else if (defaultSort) {
        setSorting([
          {
            id: defaultSort.field,
            desc: defaultSort.direction === "desc",
          },
        ]);
      } else if (sorting.length > 0) {
        setSorting([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    urlParameters.page,
    urlParameters.per_page,
    urlParameters.search,
    urlParameters.sort,
    urlParameters.direction,
  ]);

  // Extract sort field and direction from TanStack Table sorting state
  const { sortField, sortDirection } = useMemo(() => {
    const first = sorting[0];
    // If no sorting is applied, use default sort values
    if (!first) {
      return {
        sortField: defaultSort?.field ?? DEFAULT_LIST_PARAMS.sort,
        sortDirection: (defaultSort?.direction ?? DEFAULT_LIST_PARAMS.direction) as SortDirection,
      };
    }
    return {
      sortField: first.id,
      sortDirection: first.desc ? "desc" : "asc",
    };
  }, [sorting, defaultSort]);

  // Build API query parameters from current state
  const apiParameters: ListQueryParameters = useMemo(
    () =>
      mergeParameters(urlParameters, {
        page: pageIndex + 1, // Convert back to 1-based for API
        per_page: pageSize,
        search: debouncedSearch,
        sort: sortField,
        direction: sortDirection as SortDirection,
      }),
    [urlParameters, pageIndex, pageSize, debouncedSearch, sortField, sortDirection],
  );

  const queryString = useMemo(() => serializeParameters(apiParameters), [apiParameters]);

  const { data, isLoading, error, isFetching, isPlaceholderData } = useQuery({
    queryKey: [...queryKey, apiParameters],
    queryFn: async () => {
      const url = `${endpoint}?${queryString}`;
      const response = await http.get<T[]>(url, { requireAuth: true, token });
      if (response.status === "error") {
        throw new Error(response.message);
      }
      return response;
    },
    // Only fetch when authenticated and search term is empty or at least 2 characters
    enabled: !!token && (debouncedSearch.length === 0 || debouncedSearch.length >= 2),
    // Prevent showing stale data during transitions
    placeholderData: undefined,
    // Ensure we always get fresh data for server-side operations
    refetchOnMount: true,
  });

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Synchronize URL with internal state changes (only when state changes, not when URL changes)
  useEffect(() => {
    const current = searchParameters?.toString() ?? "";
    // Only update URL if it's different from what our internal state represents
    if (current === queryString) return;
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(nextUrl, { scroll: false });
    // searchParameters is intentionally NOT in dependencies to avoid fighting external URL changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString, pathname, router]);

  const items: T[] = data?.status === "success" ? data.data : [];

  // Extract total count from API response metadata
  const total =
    data?.status === "success"
      ? ((data.meta as unknown as { pagination: Pagination })?.pagination?.total ?? items.length)
      : 0;
  const pageCount = Math.max(1, Math.ceil(total / (pageSize || 1)));

  // Utility function to invalidate related queries
  const invalidateQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  // Utility function to reset table to default parameters
  const resetParameters = useCallback(() => {
    setPageIndex(0);
    setSearch("");
    setDebouncedSearch("");

    if (defaultSort) {
      setSorting([
        {
          id: defaultSort.field,
          desc: defaultSort.direction === "desc",
        },
      ]);
    } else {
      setSorting([]);
    }
  }, [defaultSort]);

  // Track if we're in a transition state (parameters changed but data hasn't updated yet)
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Track previous parameters to detect changes
  const [previousParameters, setPreviousParameters] = useState(apiParameters);

  // Detect parameter changes and set transition state
  useEffect(() => {
    const parametersChanged = JSON.stringify(previousParameters) !== JSON.stringify(apiParameters);
    if (parametersChanged) {
      setIsTransitioning(true);
      setPreviousParameters(apiParameters);
    }
  }, [apiParameters, previousParameters]);

  // Clear transition state when new data arrives
  useEffect(() => {
    if (data && !isLoading) {
      setIsTransitioning(false);
    }
  }, [data, isLoading]);

  // Determine the appropriate loading state
  const isTableLoading = isLoading || isTransitioning || (isFetching && !data);

  return {
    // Table data
    data: items,
    loading: isTableLoading,
    error,
    total,
    pageCount,

    // Search configuration
    searchConfig: {
      keys: searchKeys,
      placeholder: `Search ${searchKeys.join(", ")}...`,
      value: search,
      onChange: (value: string) => {
        setSearch(value);
        setPageIndex(0); // Reset to first page when searching
      },
    },

    // Pagination configuration
    paginationConfig: {
      show: true,
      pageSize,
      pageCount,
      totalItems: total,
      currentPage: pageIndex,
      onPageChange: (next: number) => setPageIndex(Math.max(0, Math.min(next, pageCount - 1))),
      onPageSizeChange: (size: number) => {
        setPageSize(size);
        setPageIndex(0); // Reset to first page when changing page size
      },
    },

    // Sorting configuration
    sortingConfig: {
      value: sorting,
      onChange: (next: SortingState) => {
        setSorting(next);
        setPageIndex(0); // Reset to first page when sorting changes
      },
    },

    // Server configuration
    serverConfig: {
      enabled: true,
      loading: isTableLoading,
    },

    // Additional loading states for fine-grained control
    loadingStates: {
      initial: isLoading,
      fetching: isFetching,
      isPlaceholderData,
      transitioning: isTransitioning,
    },

    // Utility functions
    invalidateQueries,
    resetParameters,
  };
}
