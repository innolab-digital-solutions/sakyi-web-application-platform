"use client";

import { ChevronDown, Filter, Loader2, RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
import type { Role } from "@/types/admin/role";

interface StaffAccountFiltersDropdownProperties {
  isLoading?: boolean;
}

const STATUS_OPTIONS: { label: string; value: string | undefined }[] = [
  { label: "All statuses", value: undefined },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const GENDER_OPTIONS: { label: string; value: string | undefined }[] = [
  { label: "All genders", value: undefined },
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Other", value: "other" },
];

export default function StaffAccountFiltersDropdown({
  isLoading = false,
}: StaffAccountFiltersDropdownProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const { data: roleData, isFetching: loadingRoles } = useRequest({
    url: ENDPOINTS.META.ROLES,
    queryKey: ["roles"],
    requireAuth: true,
    staleTime: 1000 * 60 * 5,
  });

  const roleList: Role[] = roleData && Array.isArray(roleData.data) ? roleData.data : [];

  const replaceParameters = (next: URLSearchParams) => {
    next.set("page", "1");
    const query = next.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url, { scroll: false });
  };

  const setParameter = (key: string, value: string | undefined) => {
    if (isLoading) return;
    const next = new URLSearchParams(searchParameters.toString());
    if (value === undefined) next.delete(key);
    else next.set(key, value);
    replaceParameters(next);
  };

  const clearFilters = () => {
    if (isLoading) return;
    const next = new URLSearchParams(searchParameters.toString());
    for (const key of ["role", "status", "gender"]) next.delete(key);
    replaceParameters(next);
  };

  const currentRole = searchParameters.get("role");
  const currentStatus = searchParameters.get("status");
  const currentGender = searchParameters.get("gender");

  return (
    <div className="ml-auto hidden lg:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="hover:!text-foreground ml-auto hidden h-10 font-medium hover:!bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
            disabled={isLoading}
            aria-label="Open staff filters"
          >
            <Filter className="mr-1 h-4 w-4" />
            <span className="hidden sm:block">Filters</span>
            {isLoading ? (
              <Loader2 className="ml-1 h-4 w-4 animate-spin" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[300px]">
          <DropdownMenuLabel>Filter Staff Accounts</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Role Select */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Role
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <Select
              value={currentRole ?? undefined}
              onValueChange={(value) =>
                setParameter("role", value === "__all__" ? undefined : value)
              }
              disabled={isLoading || loadingRoles}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder={loadingRoles ? "Loading roles..." : "All roles"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="__all__"
                  className="hover:!bg-accent/10 hover:!text-accent focus:!bg-accent/20 focus:!text-accent font-medium"
                >
                  All Roles
                </SelectItem>
                {roleList.map((role) => (
                  <SelectItem
                    key={`role-${role.id}`}
                    value={String(role.name)}
                    className="hover:!bg-accent/10 hover:!text-accent focus:!bg-accent/20 focus:!text-accent font-medium"
                  >
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Select */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Account Status
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <Select
              value={currentStatus ?? undefined}
              onValueChange={(value) =>
                setParameter("status", value === "__all__" ? undefined : value)
              }
              disabled={isLoading}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="__all__"
                  className="hover:!bg-accent/10 hover:!text-accent focus:!bg-accent/20 focus:!text-accent font-medium"
                >
                  All statuses
                </SelectItem>
                {STATUS_OPTIONS.filter((option) => option.value !== undefined).map(
                  ({ label, value }) => (
                    <SelectItem
                      key={`status-${label}`}
                      value={value!}
                      className="hover:!bg-accent/10 hover:!text-accent focus:!bg-accent/20 focus:!text-accent font-medium"
                    >
                      {label}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Gender Select */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Gender
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <Select
              value={currentGender ?? undefined}
              onValueChange={(value) =>
                setParameter("gender", value === "__all__" ? undefined : value)
              }
              disabled={isLoading}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="All genders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="__all__"
                  className="hover:!bg-accent/10 hover:!text-accent focus:!bg-accent/20 focus:!text-accent font-medium"
                >
                  All genders
                </SelectItem>
                {GENDER_OPTIONS.filter((option) => option.value !== undefined).map(
                  ({ label, value }) => (
                    <SelectItem
                      key={`gender-${label}`}
                      value={value!}
                      className="hover:!bg-accent/10 hover:!text-accent focus:!bg-accent/20 focus:!text-accent font-medium"
                    >
                      {label}
                    </SelectItem>
                  ),
                )}
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
