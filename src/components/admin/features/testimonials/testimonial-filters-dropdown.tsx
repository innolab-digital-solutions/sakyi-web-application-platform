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
import { Enrollment } from "@/types/admin/testimonial";

interface TestimonialFiltersDropdownProperties {
  isLoading?: boolean;
}

export default function TestimonialFiltersDropdown({
  isLoading = false,
}: TestimonialFiltersDropdownProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  // Fetch enrollments (for program filter)
  const { data: enrollmentData, isFetching: loadingEnrollments } = useRequest<{
    status: string;
    message: string;
    data: Enrollment[];
  }>({
    url: ENDPOINTS.LOOKUP.ENROLLMENTS,
    queryKey: ["lookup-enrollments"],
    staleTime: 1000 * 60 * 5,
  });

  const ratingOptions = [
    { label: "All Ratings", value: "__all__" },
    { label: "1 Star", value: "1" },
    { label: "2 Stars", value: "2" },
    { label: "3 Stars", value: "3" },
    { label: "4 Stars", value: "4" },
    { label: "5 Stars", value: "5" },
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
    for (const key of ["program", "rating"]) next.delete(key);
    replaceParameters(next);
  };

  const currentProgram = searchParameters.get("program");
  const currentRating = searchParameters.get("rating");
  const activeFiltersCount = [currentProgram, currentRating].filter(Boolean).length;
  const hasActiveFilters = activeFiltersCount > 0;

  // Extract unique programs from enrollments
  // Extract unique programs from enrollments without using reduce
  const programList: { id: number; title: string }[] = [];
  const programIds = new Set<number>();

  if (Array.isArray(enrollmentData?.data)) {
    for (const enrollment of enrollmentData.data) {
      if (enrollment.program && !programIds.has(enrollment.program.id)) {
        // Use title from API
        programList.push({ id: enrollment.program.id, title: enrollment.program.title });
        programIds.add(enrollment.program.id);
      }
    }
  }

  return (
    <div className="ml-auto hidden lg:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="hover:!text-foreground relative ml-auto hidden h-10 font-medium hover:!bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
            disabled={isLoading}
            aria-label="Open testimonial filters"
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
          <DropdownMenuLabel>Filter Testimonials</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* Program Select */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Program
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <Select
              value={currentProgram ?? "__all__"}
              onValueChange={(value) =>
                setParameter("program", value === "__all__" ? undefined : value)
              }
              disabled={isLoading || loadingEnrollments}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue
                  placeholder={loadingEnrollments ? "Loading programs..." : "All programs"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Programs</SelectItem>
                {programList.map((program) => (
                  <SelectItem key={program.id} value={String(program.title)}>
                    {program.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rating Select */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Rating
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <Select
              value={currentRating ?? "__all__"}
              onValueChange={(value) =>
                setParameter("rating", value === "__all__" ? undefined : value)
              }
              disabled={isLoading}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder="All ratings" />
              </SelectTrigger>
              <SelectContent>
                {ratingOptions.map((option) => (
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
