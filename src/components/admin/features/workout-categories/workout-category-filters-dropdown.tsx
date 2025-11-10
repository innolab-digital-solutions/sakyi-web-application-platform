"use client";

import { Check, ChevronDown, Filter, RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
import { Spinner } from "@/components/ui/spinner";

const CATEGORY_FILTERS: {
  label: string;
  value: "parent" | "child" | undefined;
}[] = [
  { label: "All categories", value: undefined },
  { label: "Parent categories", value: "parent" },
  { label: "Child categories", value: "child" },
];

interface WorkoutCategoryFiltersDropdownProperties {
  isLoading?: boolean;
}

export default function WorkoutCategoryFiltersDropdown({
  isLoading = false,
}: WorkoutCategoryFiltersDropdownProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const replaceParameters = (next: URLSearchParams) => {
    // Always reset to page 1 when filtering changes
    next.set("page", "1");

    // Ensure required parameters are present
    if (!next.has("per_page")) next.set("per_page", "10");
    if (!next.has("sort")) next.set("sort", "id");
    if (!next.has("direction")) next.set("direction", "desc");

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
    // Reset to default parameters only - remove all filter parameters
    const next = new URLSearchParams();
    next.set("page", "1");
    next.set("per_page", searchParameters.get("per_page") || "10");
    next.set("sort", searchParameters.get("sort") || "id");
    next.set("direction", searchParameters.get("direction") || "desc");
    // Don't call replaceParameters as it might add the filter back
    const query = next.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url, { scroll: false });
  };

  const currentOnly = searchParameters.get("only");

  const setOnly = (value: "parent" | "child" | undefined) => setParameter("only", value);

  const isActive = (value: string | undefined) => {
    if (value === undefined) return currentOnly === null || currentOnly === "";
    return currentOnly === value;
  };

  const hasActiveFilters = currentOnly !== null && currentOnly !== "";

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="hover:!text-foreground relative ml-auto hidden h-10 font-medium hover:!bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
            disabled={isLoading}
          >
            <Filter className="mr-1 h-4 w-4" />
            <span className="hidden sm:block">Filters</span>
            {hasActiveFilters && (
              <Badge
                variant="default"
                className="bg-primary text-primary-foreground absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold"
              >
                1
              </Badge>
            )}
            {isLoading ? <Spinner /> : <ChevronDown className="ml-1 h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          <DropdownMenuLabel>Category Type</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {CATEGORY_FILTERS.map(({ label, value }) => (
            <DropdownMenuItem
              key={label}
              onClick={() => setOnly(value)}
              onSelect={(event) => event.preventDefault()}
              disabled={isLoading}
              className={`group flex cursor-pointer items-center rounded-md px-2 py-2 transition-colors duration-150 ${
                isActive(value)
                  ? "!bg-accent/10 !text-accent"
                  : "hover:!bg-accent/5 hover:!text-accent"
              } `}
            >
              {isActive(value) ? (
                <Check className="text-accent mr-2 h-4 w-4 transition-colors duration-150" />
              ) : (
                <span className="mr-6" />
              )}
              {label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={clearFilters}
            onSelect={(event) => event.preventDefault()}
            disabled={isLoading}
            className="hover:!bg-destructive/10 hover:!text-destructive group text-destructive flex cursor-pointer items-center rounded-md px-2 py-2 font-semibold transition-colors duration-150"
          >
            <RotateCcw className="text-destructive group-hover:!text-destructive mr-2 h-4 w-4 transition-colors duration-150" />
            Reset filters
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
