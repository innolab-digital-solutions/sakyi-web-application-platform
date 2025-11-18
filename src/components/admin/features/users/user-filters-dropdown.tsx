"use client";

import { ChevronDown, Filter, Loader2, RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";

interface UserFiltersDropdownProperties {
  isLoading?: boolean;
}

export default function UserFiltersDropdown({ isLoading = false }: UserFiltersDropdownProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  // Fetch roles
  const { data: roleData, isFetching: loadingRoles } = useRequest<{
    status: string;
    message: string;
    data: { id: number; name: string }[];
  }>({
    url: ENDPOINTS.LOOKUP.ROLES,
    queryKey: ["lookup-roles"],
    staleTime: 1000 * 60 * 5,
  });

  // Fetch genders
  const { data: genderData, isFetching: loadingGenders } = useRequest<{
    status: string;
    message: string;
    data: string[];
  }>({
    url: ENDPOINTS.LOOKUP.USERS,
    queryKey: ["lookup-users"],
    staleTime: 1000 * 60 * 5,
  });

  const replaceParameters = (next: URLSearchParams) => {
    next.set("page", "1");
    const query = next.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url, { scroll: false });
  };

  const setParameter = (key: string, value: string | undefined) => {
    if (isLoading) return;
    const next = new URLSearchParams(searchParameters.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    replaceParameters(next);
  };

  const clearFilters = () => {
    if (isLoading) return;
    const next = new URLSearchParams(searchParameters.toString());
    for (const key of ["role", "gender"]) next.delete(key);
    replaceParameters(next);
  };

  const currentRole = searchParameters.get("role");
  const currentGender = searchParameters.get("gender");
  const activeFiltersCount = [currentRole, currentGender].filter(Boolean).length;
  const hasActiveFilters = activeFiltersCount > 0;

  const roleList = Array.isArray(roleData?.data) ? roleData.data : [];
  const genderList = Array.isArray(genderData?.data) ? genderData.data : [];

  return (
    <div className="ml-auto hidden lg:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="hover:!text-foreground relative ml-auto hidden h-10 font-medium hover:!bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
            disabled={isLoading}
            aria-label="Open user filters"
          >
            <Filter className="mr-1 h-4 w-4" />
            <span className="hidden sm:block">Filters</span>
            {hasActiveFilters && (
              <Badge
                variant="default"
                className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold"
              >
                {activeFiltersCount}
              </Badge>
            )}
            {isLoading ? (
              <Loader2 className="ml-1 h-4 w-4 animate-spin" />
            ) : (
              <ChevronDown className="ml-1 h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-[300px]">
          <DropdownMenuLabel>Filter Users</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Role Select */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Role
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <Select
              value={currentRole ?? "__all__"}
              onValueChange={(value) =>
                setParameter("role", value === "__all__" ? undefined : value)
              }
              disabled={isLoading || loadingRoles}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder={loadingRoles ? "Loading roles..." : "All roles"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Roles</SelectItem>
                {roleList.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Gender Select */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Gender
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <Select
              value={currentGender ?? "__all__"}
              onValueChange={(value) =>
                setParameter("gender", value === "__all__" ? undefined : value)
              }
              disabled={isLoading || loadingGenders}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder={loadingGenders ? "Loading genders..." : "All genders"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Genders</SelectItem>
                {genderList.map((gender) => (
                  <SelectItem key={gender} value={gender}>
                    {gender.charAt(0).toUpperCase() + gender.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={clearFilters}
            onSelect={(event) => event.preventDefault()}
            disabled={isLoading}
            className="hover:!bg-destructive/10 hover:!text-destructive group text-destructive flex cursor-pointer items-center rounded-md px-2 py-2 font-semibold transition-colors duration-150"
          >
            <RotateCcw className="text-destructive group-hover:!text-destructive mr-2 h-4 w-4 transition-colors duration-150" />
            Reset Filters
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
