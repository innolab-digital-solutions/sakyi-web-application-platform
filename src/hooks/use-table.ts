"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SortingState } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { http } from "@/lib/api/client";
import { Pagination } from "@/types/shared/common";
import { ListQueryParameters, SortDirection } from "@/types/shared/parameters";
import {
  DEFAULT_LIST_PARAMS,
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
 * Server-side table operations hook
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
  const queryClient = useQueryClient();

  // Track if this is the initial mount to initialize URL parameters
  const [isInitialMount, setIsInitialMount] = useState(true);

  // Use ref to track if we're syncing from URL (avoids re-render issues)
  const isSyncingFromUrlReference = useRef(false);

  // Parse URL parameters - this will update when URL changes
  const urlParameters = useMemo(
    () => parseListParameters(searchParameters, DEFAULT_LIST_PARAMS),
    [searchParameters],
  );

  // Determine if URL has any query parameters at all
  const hasUrlParameters = useMemo(() => {
    return searchParameters?.toString().length > 0;
  }, [searchParameters]);

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

  // Initialize URL parameters on mount if they don't exist
  useEffect(() => {
    if (isInitialMount && !hasUrlParameters) {
      // Build initial parameters with defaults
      const initialParameters: ListQueryParameters = {
        page: DEFAULT_LIST_PARAMS.page,
        per_page: DEFAULT_LIST_PARAMS.per_page,
        sort: defaultSort?.field ?? DEFAULT_LIST_PARAMS.sort,
        direction: (defaultSort?.direction ?? DEFAULT_LIST_PARAMS.direction) as SortDirection,
      };

      const queryString = serializeParameters(initialParameters);
      const nextUrl = `${pathname}?${queryString}`;

      // Use replace to avoid adding to browser history
      router.replace(nextUrl, { scroll: false });
      setIsInitialMount(false);
    } else if (isInitialMount) {
      // URL has parameters, just mark as initialized
      setIsInitialMount(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialMount, hasUrlParameters, pathname]);

  // Sync internal state when URL changes externally (e.g., from form resets or filter changes)
  // Only update if values actually differ to prevent infinite loops
  useEffect(() => {
    // Skip sync during initial mount to avoid conflicts
    if (isInitialMount) return;

    const newPageIndex = Math.max(0, (urlParameters.page ?? 1) - 1);
    const newPageSize = urlParameters.per_page ?? DEFAULT_LIST_PARAMS.per_page;
    const newSearch = urlParameters.search ?? "";

    // Check if anything actually changed
    const pageChanged = pageIndex !== newPageIndex;
    const sizeChanged = pageSize !== newPageSize;
    const searchChanged = search !== newSearch;

    // Check if sorting changed
    const currentSortId = sorting[0]?.id;
    const currentSortDesc = sorting[0]?.desc;
    const urlSortId = urlParameters.sort ? String(urlParameters.sort) : defaultSort?.field;
    const urlSortDesc = urlParameters.sort
      ? (urlParameters.direction ?? DEFAULT_LIST_PARAMS.direction) === "desc"
      : defaultSort?.direction === "desc";
    const sortingChanged = currentSortId !== urlSortId || currentSortDesc !== urlSortDesc;

    // If nothing changed, don't update
    if (!pageChanged && !sizeChanged && !searchChanged && !sortingChanged) {
      return;
    }

    // Set syncing flag to prevent URL update effect from running
    isSyncingFromUrlReference.current = true;

    // Log for debugging
    // eslint-disable-next-line no-console
    console.log("🔄 URL changed externally, syncing state:", {
      pageChanged,
      newPageIndex,
      urlParameters,
    });

    // Batch state updates in a microtask to ensure they happen together
    Promise.resolve().then(() => {
      if (pageChanged) {
        setPageIndex(newPageIndex);
      }
      if (sizeChanged) {
        setPageSize(newPageSize);
      }
      if (searchChanged) {
        setSearch(newSearch);
        setDebouncedSearch(newSearch);
      }

      // Update sorting if it changed
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

      // Clear flag after updates complete
      setTimeout(() => {
        isSyncingFromUrlReference.current = false;
      }, 100);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParameters?.toString()]);

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

  // Build API query parameters from current internal state
  // Don't use urlParameters here to avoid feedback loops - use internal state only
  const apiParameters: ListQueryParameters = useMemo(() => {
    const parameters: ListQueryParameters = {
      page: pageIndex + 1, // Convert back to 1-based for API
      per_page: pageSize,
      search: debouncedSearch,
      sort: sortField,
      direction: sortDirection as SortDirection,
    };

    // Include any additional filter parameters from URL (like 'only', etc.)
    for (const [key, value] of Object.entries(urlParameters)) {
      if (!["page", "per_page", "search", "sort", "direction"].includes(key)) {
        parameters[key] = value;
      }
    }

    return parameters;
  }, [pageIndex, pageSize, debouncedSearch, sortField, sortDirection, urlParameters]);

  const queryString = useMemo(() => serializeParameters(apiParameters), [apiParameters]);

  // Enable query when search is either empty or has valid content
  const isQueryEnabled = debouncedSearch.length === 0 || debouncedSearch.length > 0;

  const { data, isLoading, error, isFetching, isPlaceholderData } = useQuery({
    queryKey: [...queryKey, apiParameters],
    queryFn: async () => {
      const url = `${endpoint}?${queryString}`;
      // Session authentication is handled automatically via cookies
      const response = await http.get<T[]>(url);
      if (response.status === "error") {
        throw new Error(response.message);
      }
      return response;
    },
    enabled: isQueryEnabled,
    // Prevent showing stale data during transitions
    placeholderData: undefined,
    // Ensure we always get fresh data for server-side operations
    refetchOnMount: true,
  });

  // Debounce search input to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 600);
    return () => clearTimeout(timer);
  }, [search]);

  // Synchronize URL with internal state changes (only when state changes, not when URL changes)
  useEffect(() => {
    // Skip URL sync during initial mount - let the initialization effect handle it
    if (isInitialMount) return;

    // Skip URL sync when we're syncing state FROM the URL to prevent fighting
    if (isSyncingFromUrlReference.current) {
      // eslint-disable-next-line no-console
      console.log("⏸️ Skipping URL update - currently syncing FROM URL");
      return;
    }

    const current = searchParameters?.toString() ?? "";
    // Only update URL if it's different from what our internal state represents
    if (current === queryString) return;

    // eslint-disable-next-line no-console
    console.log("📝 Updating URL from internal state:", {
      from: current,
      to: queryString,
    });

    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(nextUrl, { scroll: false });
    // searchParameters is intentionally NOT in dependencies to avoid fighting external URL changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString, pathname, router, isInitialMount]);

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
    if (!isQueryEnabled) {
      // If query is disabled (e.g., search length = 1), never show transitioning
      setIsTransitioning(false);
      setPreviousParameters(apiParameters);
      return;
    }
    if (parametersChanged) {
      setIsTransitioning(true);
      setPreviousParameters(apiParameters);
    }
  }, [apiParameters, previousParameters, isQueryEnabled]);

  // Clear transition state when new data arrives
  useEffect(() => {
    if (data && !isLoading) {
      setIsTransitioning(false);
    }
  }, [data, isLoading]);

  // Determine the appropriate loading state
  const isTableLoading = isQueryEnabled && (isLoading || isTransitioning || (isFetching && !data));

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
};
