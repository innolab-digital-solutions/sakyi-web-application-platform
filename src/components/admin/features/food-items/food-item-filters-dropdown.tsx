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
import type { FoodCategory } from "@/types/admin/food-category";

interface FoodItemFiltersDropdownProperties {
  isLoading?: boolean;
}

export default function FoodItemFiltersDropdown({
  isLoading = false,
}: FoodItemFiltersDropdownProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const { data: categoryData, isFetching: loadingCategories } = useRequest<{
    status: string;
    message: string;
    data: FoodCategory[];
  }>({
    url: ENDPOINTS.LOOKUP.FOOD_CATEGORIES,
    queryKey: ["lookup-food-categories"],
    staleTime: 1000 * 60 * 5,
  });

  const categoryList = (categoryData?.data ?? []) as FoodCategory[];

  const replaceParameters = (next: URLSearchParams) => {
    next.set("page", "1");
    const query = next.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url, { scroll: false });
  };

  const setParameter = (key: string, value: string | undefined) => {
    if (isLoading) return;
    const next = new URLSearchParams(searchParameters.toString());
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    replaceParameters(next);
  };

  const clearFilters = () => {
    if (isLoading) return;
    const next = new URLSearchParams(searchParameters.toString());
    for (const key of ["category"]) next.delete(key);
    replaceParameters(next);
  };

  const currentCategory = searchParameters.get("category");
  const activeFiltersCount = [currentCategory].filter(Boolean).length;
  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="ml-auto hidden lg:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="hover:text-foreground! relative ml-auto hidden h-10 font-medium hover:bg-gray-100! disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
            disabled={isLoading}
            aria-label="Open food item filters"
          >
            <Filter className="mr-1 h-4 w-4" />
            <span className="hidden sm:block">Filters</span>
            {hasActiveFilters && (
              <Badge
                variant="secondary"
                className="text-accent absolute -top-2.5 -right-2 flex h-5 min-w-3 items-center justify-center rounded-full px-1.5 text-[10px] font-bold"
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
          <DropdownMenuLabel>Record Filters</DropdownMenuLabel>
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
                {categoryList.map((category: FoodCategory) => (
                  <SelectItem key={category.id} value={String(category.name)}>
                    {category.name}
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
            className="hover:bg-destructive/10! hover:text-destructive! group text-destructive flex cursor-pointer items-center rounded-md px-5 py-2 font-semibold transition-colors duration-150"
          >
            <RotateCcw className="text-destructive group-hover:text-destructive! h-4 w-4 transition-colors duration-150" />
            Reset Filters
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
