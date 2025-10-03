/* eslint-disable unicorn/no-useless-undefined */
"use client";

import { Check, ChevronDown, Filter, RotateCcw } from "lucide-react";
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

export default function WorkoutCategoryFiltersDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const replaceParameters = (next: URLSearchParams) => {
    next.set("page", "1");
    const query = next.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    router.replace(url, { scroll: false });
  };

  const setParameter = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParameters.toString());
    if (value === undefined) next.delete(key);
    else next.set(key, value);
    replaceParameters(next);
  };

  const clearFilters = () => {
    const next = new URLSearchParams(searchParameters.toString());
    next.delete("only");
    replaceParameters(next);
  };

  const currentOnly = searchParameters.get("only");

  const setOnly = (value: "parent" | "child" | undefined) => setParameter("only", value);

  const isActive = (value: string | undefined) => {
    if (value === undefined) return currentOnly === null || currentOnly === "";
    return currentOnly === value;
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="hover:!text-foreground ml-auto hidden h-10 font-medium hover:!bg-gray-100 lg:flex"
          >
            <Filter className="mr-1 h-4 w-4" />
            <span className="hidden sm:block">Filters</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          <DropdownMenuLabel>Workout Category Filters</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuLabel className="text-muted-foreground text-xs">
            Category Type
          </DropdownMenuLabel>

          <DropdownMenuItem
            onClick={() => setOnly(undefined)}
            className={`group flex cursor-pointer items-center rounded-md px-2 py-2 transition-colors duration-150 ${
              isActive(undefined)
                ? "bg-primary/10 text-primary font-semibold"
                : "hover:bg-primary/5 hover:text-primary"
            } `}
          >
            {isActive(undefined) ? (
              <Check className="text-primary mr-2 h-4 w-4 transition-colors duration-150" />
            ) : (
              <span className="mr-6" />
            )}
            All categories
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOnly("parent")}
            className={`group flex cursor-pointer items-center rounded-md px-2 py-2 transition-colors duration-150 ${
              isActive("parent")
                ? "bg-primary/10 text-primary font-semibold"
                : "hover:bg-primary/5 hover:text-primary"
            } `}
          >
            {isActive("parent") ? (
              <Check className="text-primary mr-2 h-4 w-4 transition-colors duration-150" />
            ) : (
              <span className="mr-6" />
            )}
            Parent categories
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setOnly("child")}
            className={`group flex cursor-pointer items-center rounded-md px-2 py-2 transition-colors duration-150 ${
              isActive("child")
                ? "bg-primary/10 text-primary font-semibold"
                : "hover:bg-primary/5 hover:text-primary"
            } `}
          >
            {isActive("child") ? (
              <Check className="text-primary mr-2 h-4 w-4 transition-colors duration-150" />
            ) : (
              <span className="mr-6" />
            )}
            Child categories
          </DropdownMenuItem>

          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={clearFilters}
            className={`group text-destructive hover:bg-destructive/10 hover:text-destructive flex cursor-pointer items-center rounded-md px-2 py-2 font-semibold transition-colors duration-150`}
          >
            <RotateCcw className="text-destructive group-hover:text-destructive mr-2 h-4 w-4 transition-colors duration-150" />
            Reset filters
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
