"use client";

import { useQuery } from "@tanstack/react-query";
import type { SortingState } from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import DataTable from "@/components/shared/table/data-table";
import { ADMIN_ENDPOINTS } from "@/config/endpoints/admin";
import { http } from "@/lib/api/client";
import { Role } from "@/types/admin/role";
import { ListQueryParameters } from "@/types/shared/parameters";
import { getStoredToken } from "@/utils/auth/storage";
import {
  DEFAULT_LIST_PARAMS,
  mergeParameters,
  parseListParameters,
  serializeParameters,
} from "@/utils/shared/parameters";

import { rolesColumns } from "./columns";

export function RolesTable() {
  const { token } = getStoredToken();
  const searchParameters = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // server-side controls
  const initialFromUrl = useMemo(
    () => parseListParameters(searchParameters ?? undefined, DEFAULT_LIST_PARAMS),
    [searchParameters],
  );
  const [pageIndex, setPageIndex] = useState(Math.max(0, (initialFromUrl.page ?? 1) - 1)); // 0-based
  const [pageSize, setPageSize] = useState(initialFromUrl.per_page ?? DEFAULT_LIST_PARAMS.per_page);
  const [search, setSearch] = useState(initialFromUrl.search ?? "");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>(
    initialFromUrl.sort
      ? [
          {
            id: String(initialFromUrl.sort),
            desc: (initialFromUrl.direction ?? DEFAULT_LIST_PARAMS.direction) === "desc",
          },
        ]
      : [],
  );

  const { sortField, sortDirection } = useMemo(() => {
    const first = sorting[0];
    return {
      sortField: first?.id,
      sortDirection: first ? (first.desc ? "desc" : "asc") : undefined,
    } as { sortField?: string; sortDirection?: "asc" | "desc" };
  }, [sorting]);

  const apiParameters: ListQueryParameters = useMemo(() => {
    const urlParameters = parseListParameters(undefined, DEFAULT_LIST_PARAMS);
    const merged = mergeParameters(urlParameters, {
      page: pageIndex + 1,
      per_page: pageSize,
      search: debouncedSearch,
      sort: sortField,
      direction: sortDirection,
    });
    return merged;
  }, [pageIndex, pageSize, debouncedSearch, sortField, sortDirection]);

  const queryString = useMemo(() => serializeParameters(apiParameters), [apiParameters]);

  const { data, isLoading } = useQuery<import("@/types/shared/api").ApiSuccess<Role[]>>({
    queryKey: ["admin-roles", apiParameters],
    queryFn: async () => {
      const endpoint = `${ADMIN_ENDPOINTS.ROLES.INDEX}?${queryString}`;
      const response = await http.get<Role[]>(endpoint, { requireAuth: true, token });
      if (response.status === "error") {
        throw Object.assign(new Error(response.message), { status: response.status });
      }
      return response;
    },
    // v5: use placeholderData instead of keepPreviousData
    placeholderData: (previousData) => previousData,
    enabled: !!token && (debouncedSearch.length === 0 || debouncedSearch.length >= 2),
  });

  // debounce search input
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(search.trim()), 500);
    return () => clearTimeout(handle);
  }, [search]);

  // sync URL with current params (avoid loops by checking existing query string)
  useEffect(() => {
    const current = searchParameters?.toString() ?? "";
    if (current === queryString) return;
    const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(nextUrl, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryString]);

  const roles: Role[] = data?.status === "success" ? data.data : [];
  const metaTotal: number | undefined =
    data?.status === "success"
      ? (data.meta as { pagination?: { total?: number } } | undefined)?.pagination?.total
      : undefined;
  const total = metaTotal ?? roles.length;
  const pageCount = useMemo(() => {
    const per = pageSize || 1;
    return Math.max(1, Math.ceil(total / per));
  }, [total, pageSize]);

  return (
    <DataTable
      columns={rolesColumns}
      data={roles}
      searchKeys={["name", "description"]}
      searchPlaceholder="Search roles by name or description..."
      showPagination={true}
      showColumnVisibility={true}
      showRowSelection={true}
      initialPageSize={pageSize}
      isLoading={isLoading}
      emptyMessage="No roles found. Create your first role to get started."
      manual
      pageCount={pageCount}
      totalItems={total}
      onPageChange={(next) => setPageIndex(Math.max(0, Math.min(next, pageCount - 1)))}
      onPageSizeChange={(size) => {
        setPageSize(size);
        setPageIndex(0);
      }}
      searchValue={search}
      onSearchChange={(value) => {
        setSearch(value);
        setPageIndex(0);
      }}
      sortingValue={sorting}
      onSortingChange={(next) => {
        setSorting(next);
        setPageIndex(0);
      }}
    />
  );
}
