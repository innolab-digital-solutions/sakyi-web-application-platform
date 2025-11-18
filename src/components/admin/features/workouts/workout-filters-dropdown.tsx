"use client";

import { ChevronDown, Filter, Loader2, RotateCcw } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import type { WorkoutCategory } from "@/types/admin/workout-category";

interface WorkoutFiltersDropdownProperties {
  isLoading?: boolean;
}

export default function WorkoutFiltersDropdown({
  isLoading = false,
}: WorkoutFiltersDropdownProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  // Fetch workout categories
  const { data: categoryData, isFetching: loadingCategories } = useRequest<{
    status: string;
    message: string;
    data: WorkoutCategory[];
  }>({
    url: ENDPOINTS.LOOKUP.WORKOUT_CATEGORIES,
    queryKey: ["lookup-workout-categories"],
    staleTime: 1000 * 60 * 5,
  });

  const difficultyOptions = [
    { label: "All Difficulties", value: "__all__" },
    { label: "Beginner", value: "beginner" },
    { label: "Intermediate", value: "intermediate" },
    { label: "Advanced", value: "advanced" },
  ];

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
    for (const key of ["category", "difficulty"]) next.delete(key);
    replaceParameters(next);
  };

  const currentCategory = searchParameters.get("category");
  const currentDifficulty = searchParameters.get("difficulty");
  const activeFiltersCount = [currentCategory, currentDifficulty].filter(Boolean).length;
  const hasActiveFilters = activeFiltersCount > 0;

  const categoryList = Array.isArray(categoryData?.data) ? categoryData.data : [];

  return (
    <div className="ml-auto hidden lg:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="hover:!text-foreground relative ml-auto hidden h-10 font-medium hover:!bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
            disabled={isLoading}
            aria-label="Open workout filters"
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
          <DropdownMenuLabel>Filter Workouts</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Category Select */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Category
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <Select
              value={currentCategory ?? "__all__"}
              onValueChange={(value) =>
                setParameter("category", value === "__all__" ? undefined : value)
              }
              disabled={isLoading || loadingCategories}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue
                  placeholder={loadingCategories ? "Loading categories..." : "All categories"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Categories</SelectItem>
                {categoryList.map((category) => (
                  <SelectItem key={category.id} value={String(category.name)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Difficulty Select */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Difficulty
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <Select
              value={currentDifficulty ?? "__all__"}
              onValueChange={(value) =>
                setParameter("difficulty", value === "__all__" ? undefined : value)
              }
              disabled={isLoading}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="All difficulties" />
              </SelectTrigger>
              <SelectContent>
                {difficultyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
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
