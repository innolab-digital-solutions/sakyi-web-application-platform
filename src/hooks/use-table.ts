/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-commented-code/no-commented-code */
"use client";

import { useQuery } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useQueryCache } from "@/hooks/use-query-cache";
import { http } from "@/lib/api/client";
import { Pagination } from "@/types/shared/common";
import { ListQueryParameters, SortDirection } from "@/types/shared/parameters";
import {
  DEFAULT_LIST_PARAMS,
  parseListParameters,
  serializeParameters,
} from "@/utils/shared/parameters";

/**
 * Configuration options for the useTable hook
 */
interface UseTableConfig {
  /** API endpoint for fetching table data */
  endpoint: string;
  /** TanStack Query key for caching and invalidation */
  queryKey: string[];
  /** Column keys to include in search functionality */
  searchKeys?: string[];
  /** Default sorting configuration on mount */
  defaultSort?: { field: string; direction: "asc" | "desc" };
}

/**
 * Server-side table management hook with URL state synchronization
 *
 * Provides comprehensive table functionality including:
 * - Automatic URL parameter initialization and synchronization
 * - Server-side pagination, sorting, and search
 * - Debounced search with configurable keys
 * - TanStack Query integration for data fetching
 * - Bi-directional state management (URL ↔ Internal State)
 *
 * @template T - Type of data items in the table
 * @param config - Table configuration options
 * @returns Table state, handlers, and configuration objects
 *
 * @example
 * ```tsx
 * const { data, searchConfig, paginationConfig, sortingConfig } = useTable<User>({
 *   endpoint: '/api/users',
 *   queryKey: ['users'],
 *   searchKeys: ['name', 'email'],
 *   defaultSort: { field: 'created_at', direction: 'desc' }
 * });
 * ```
 */
export const useTable = <T>({
  endpoint,
  queryKey,
  searchKeys = [],
  defaultSort,
}: UseTableConfig) => {
  const searchParameters = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const queryCache = useQueryCache();

  // ============================================================================
  // State Management
  // ============================================================================

  /** Tracks initial mount to handle URL parameter initialization */
  const [isInitialMount, setIsInitialMount] = useState(true);

  /** Ref to prevent URL update conflicts during external URL changes */
  const isSyncingFromUrlReference = useRef(false);

  /** Parse URL search parameters into structured format */
  const urlParameters = useMemo(
    () => parseListParameters(searchParameters, DEFAULT_LIST_PARAMS),
    [searchParameters],
  );

  /** Check if URL contains any query parameters */
  const hasUrlParameters = useMemo(() => {
    return searchParameters?.toString().length > 0;
  }, [searchParameters]);

  /** Current page index (0-based for TanStack Table compatibility) */
  const [pageIndex, setPageIndex] = useState(Math.max(0, (urlParameters.page ?? 1) - 1));

  /** Number of items to display per page */
  const [pageSize, setPageSize] = useState(urlParameters.per_page ?? DEFAULT_LIST_PARAMS.per_page);

  /** Current search query value */
  const [search, setSearch] = useState(urlParameters.search ?? "");

  /** Debounced search value to reduce API calls */
  const [debouncedSearch, setDebouncedSearch] = useState(urlParameters.search ?? "");

  /** Sorting state compatible with TanStack Table */
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

  // ============================================================================
  // Effects: URL Initialization & Synchronization
  // ============================================================================

  /**
   * Initialize URL parameters on mount
   *
   * Ensures consistent URL state by adding default query parameters when navigating
   * to a table page without parameters (e.g., via sidebar or breadcrumb links).
   */
  useEffect(() => {
    if (isInitialMount && !hasUrlParameters) {
      const initialParameters: ListQueryParameters = {
        page: DEFAULT_LIST_PARAMS.page,
        per_page: DEFAULT_LIST_PARAMS.per_page,
        sort: defaultSort?.field ?? DEFAULT_LIST_PARAMS.sort,
        direction: (defaultSort?.direction ?? DEFAULT_LIST_PARAMS.direction) as SortDirection,
      };

      const queryString = serializeParameters(initialParameters);
      const nextUrl = `${pathname}?${queryString}`;

      router.replace(nextUrl, { scroll: false });
      setIsInitialMount(false);
    } else if (isInitialMount) {
      setIsInitialMount(false);
    }
  }, [isInitialMount, hasUrlParameters, pathname]);

  /**
   * Synchronize internal state when URL changes externally
   *
   * Handles external URL changes from:
   * - Filter dropdowns resetting page to 1
   * - Form submissions updating parameters
   * - Browser back/forward navigation
   *
   * Uses a ref-based flag to prevent race conditions with the URL update effect.
   */
  useEffect(() => {
    if (isInitialMount) return;

    const newPageIndex = Math.max(0, (urlParameters.page ?? 1) - 1);
    const newPageSize = urlParameters.per_page ?? DEFAULT_LIST_PARAMS.per_page;
    const newSearch = urlParameters.search ?? "";

    const pageChanged = pageIndex !== newPageIndex;
    const sizeChanged = pageSize !== newPageSize;
    const searchChanged = search !== newSearch;

    const currentSortId = sorting[0]?.id;
    const currentSortDesc = sorting[0]?.desc;
    const urlSortId = urlParameters.sort ? String(urlParameters.sort) : defaultSort?.field;
    const urlSortDesc = urlParameters.sort
      ? (urlParameters.direction ?? DEFAULT_LIST_PARAMS.direction) === "desc"
      : defaultSort?.direction === "desc";
    const sortingChanged = currentSortId !== urlSortId || currentSortDesc !== urlSortDesc;

    if (!pageChanged && !sizeChanged && !searchChanged && !sortingChanged) {
      return;
    }

    // Prevent URL update effect from running during this sync
    isSyncingFromUrlReference.current = true;

    // Batch state updates to ensure they happen together
    Promise.resolve().then(() => {
      if (pageChanged) setPageIndex(newPageIndex);
      if (sizeChanged) setPageSize(newPageSize);
      if (searchChanged) {
        setSearch(newSearch);
        setDebouncedSearch(newSearch);
      }

      if (sortingChanged) {
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

      setTimeout(() => {
        isSyncingFromUrlReference.current = false;
      }, 100);
    });
  }, [searchParameters?.toString()]);

  // ============================================================================
  // Computed Values
  // ============================================================================

  /** Extract sort configuration from TanStack Table format */
  const { sortField, sortDirection } = useMemo(() => {
    const first = sorting[0];
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

  /**
   * Build API query parameters from internal state
   *
   * Uses internal state as source of truth to avoid feedback loops.
   * Includes additional filter parameters from URL (e.g., 'only', 'status').
   */
  const apiParameters: ListQueryParameters = useMemo(() => {
    const parameters: ListQueryParameters = {
      page: pageIndex + 1,
      per_page: pageSize,
      search: debouncedSearch,
      sort: sortField,
      direction: sortDirection as SortDirection,
    };

    for (const [key, value] of Object.entries(urlParameters)) {
      if (!["page", "per_page", "search", "sort", "direction"].includes(key)) {
        parameters[key] = value;
      }
    }

    return parameters;
  }, [
    pageIndex,
    pageSize,
    debouncedSearch,
    sortField,
    sortDirection,
    searchParameters?.toString(),
  ]);

  /** Serialize parameters for URL and API requests */
  const queryString = useMemo(() => serializeParameters(apiParameters), [apiParameters]);

  /** Enable query for all search states (empty or with content) */
  const isQueryEnabled = true;

  // ============================================================================
  // Data Fetching
  // ============================================================================

  /** TanStack Query for server-side table data fetching */
  const { data, isLoading, error, isFetching, isPlaceholderData } = useQuery({
    queryKey: [...queryKey, apiParameters],
    queryFn: async () => {
      const url = `${endpoint}?${queryString}`;
      const response = await http.get<T[]>(url);
      if (response.status === "error") {
        throw new Error(response.message);
      }
      return response;
    },
    enabled: isQueryEnabled,
    placeholderData: undefined,
    refetchOnMount: true,
  });

  /**
   * Debounce search input
   *
   * Reduces API calls by waiting 600ms after user stops typing.
   */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 600);
    return () => clearTimeout(timer);
  }, [search]);

  /**
   * Update URL when internal state changes
   *
   * Skips during:
   * - Initial mount (handled by initialization effect)
   * - External URL sync (prevents race conditions)
   */
  useEffect(() => {
    if (isInitialMount) return;

    if (isSyncingFromUrlReference.current) {
      return;
    }

    const current = searchParameters?.toString() ?? "";
    if (current === queryString) return;

    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [queryString, pathname, router, isInitialMount]);

  // ============================================================================
  // Data Processing
  // ============================================================================

  /** Extract items from API response */
  const items: T[] = data?.status === "success" ? data.data : [];

  /** Extract total count from pagination metadata */
  const total =
    data?.status === "success"
      ? ((data.meta as unknown as { pagination: Pagination })?.pagination?.total ?? items.length)
      : 0;

  /** Calculate total number of pages */
  const pageCount = Math.max(1, Math.ceil(total / (pageSize || 1)));

  // ============================================================================
  // Utility Functions
  // ============================================================================

  /**
   * Invalidate the current table query cache
   *
   * Triggers a refetch of table data. Useful after mutations.
   */
  const invalidateQueries = useCallback(() => {
    queryCache.invalidateQueries(queryKey);
  }, [queryCache, queryKey]);

  /**
   * Reset table to default state
   *
   * Clears search, resets pagination, and applies default sorting.
   */
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

  // ============================================================================
  // Loading State Management
  // ============================================================================

  /** Track transition state (parameters changed but data not yet loaded) */
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousParameters, setPreviousParameters] = useState(apiParameters);

  /** Detect parameter changes and set transition state */
  useEffect(() => {
    const parametersChanged = JSON.stringify(previousParameters) !== JSON.stringify(apiParameters);
    if (!isQueryEnabled) {
      setIsTransitioning(false);
      setPreviousParameters(apiParameters);
      return;
    }
    if (parametersChanged) {
      setIsTransitioning(true);
      setPreviousParameters(apiParameters);
    }
  }, [apiParameters, previousParameters, isQueryEnabled]);

  /** Clear transition state when new data arrives */
  useEffect(() => {
    if (data && !isLoading) {
      setIsTransitioning(false);
    }
  }, [data, isLoading]);

  /** Unified loading state for table UI */
  const isTableLoading = isQueryEnabled && (isLoading || isTransitioning || (isFetching && !data));

  // ============================================================================
  // Return Configuration Objects
  // ============================================================================

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

    // Query cache management
    queryCache,
  };
};
