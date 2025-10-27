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
import type { FoodCategory } from "@/types/admin/food-category";
import type { Unit } from "@/types/admin/unit";

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
    url: ENDPOINTS.META.FOOD_ITEMS,
    queryKey: ["meta-food-items"],
    staleTime: 1000 * 60 * 5,
  });

  const { data: unitData, isFetching: loadingUnits } = useRequest<{
    status: string;
    message: string;
    data: Unit[];
  }>({
    url: ENDPOINTS.META.UNITS,
    queryKey: ["meta-units"],
    staleTime: 1000 * 60 * 5,
  });

  const categoryList = (categoryData?.data ?? []) as FoodCategory[];
  const unitList = (unitData?.data ?? []) as Unit[];

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
    for (const key of ["category", "unit"]) next.delete(key);
    replaceParameters(next);
  };

  const currentCategory = searchParameters.get("category");
  const currentUnit = searchParameters.get("unit");

  return (
    <div className="ml-auto hidden lg:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="hover:!text-foreground ml-auto hidden h-10 font-medium hover:!bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
            disabled={isLoading}
            aria-label="Open food item filters"
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
          <DropdownMenuLabel>Filter Food Items</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Category Select */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Category
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <Select
              value={currentCategory ?? undefined}
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

          {/* Unit Select */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Unit
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <Select
              value={currentUnit ?? undefined}
              onValueChange={(value) =>
                setParameter("unit", value === "__all__" ? undefined : value)
              }
              disabled={isLoading || loadingUnits}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder={loadingUnits ? "Loading units..." : "All units"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Units</SelectItem>
                {unitList.map((unit: Unit) => (
                  <SelectItem key={unit.id} value={String(unit.name)}>
                    {unit.name}
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
