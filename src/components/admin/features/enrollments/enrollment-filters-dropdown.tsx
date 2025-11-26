"use client";

import { ChevronDown, Filter, Loader2, RotateCcw } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import DatepickerField from "@/components/shared/forms/datepicker-field";
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
import type { Program } from "@/types/admin/program";
import type { Team } from "@/types/admin/team";

interface EnrollmentFiltersDropdownProperties {
  isLoading?: boolean;
}

export default function EnrollmentFiltersDropdown({
  isLoading = false,
}: EnrollmentFiltersDropdownProperties) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  // Fetch Teams
  const { data: teamData, isFetching: loadingTeams } = useRequest<{
    status: string;
    message: string;
    data: Team[];
  }>({
    url: ENDPOINTS.LOOKUP.TEAMS,
    queryKey: ["lookup-teams"],
    staleTime: 1000 * 60 * 5,
  });

  // Fetch Programs
  const { data: programData, isFetching: loadingPrograms } = useRequest<{
    status: string;
    message: string;
    data: Program[];
  }>({
    url: ENDPOINTS.LOOKUP.PROGRAMS,
    queryKey: ["lookup-programs"],
    staleTime: 1000 * 60 * 5,
  });

  const teams = (teamData?.data ?? []) as Team[];
  const programs = (programData?.data ?? []) as Program[];

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
    for (const key of ["team", "program", "status", "started_at", "ended_at"]) next.delete(key);
    replaceParameters(next);
  };

  const currentTeam = searchParameters.get("team");
  const currentProgram = searchParameters.get("program");
  const currentStatus = searchParameters.get("status");
  const currentStartedAt = searchParameters.get("started_at");
  const currentEndedAt = searchParameters.get("ended_at");

  const activeFiltersCount = [
    currentTeam,
    currentProgram,
    currentStatus,
    currentStartedAt,
    currentEndedAt,
  ].filter(Boolean).length;
  const hasActiveFilters = activeFiltersCount > 0;

  return (
    <div className="ml-auto hidden lg:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="hover:!text-foreground relative ml-auto hidden h-10 font-medium hover:!bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 lg:flex"
            disabled={isLoading}
            aria-label="Open enrollment filters"
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
          <DropdownMenuLabel>Filter Enrollments</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {/* TEAM */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Team
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <Select
              value={currentTeam ?? undefined}
              onValueChange={(value) =>
                setParameter("team", value === "__all__" ? undefined : value)
              }
              disabled={isLoading || loadingTeams}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue placeholder={loadingTeams ? "Loading teams..." : "All teams"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Teams</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={String(team.name)}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* PROGRAM */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Program
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <Select
              value={currentProgram ?? undefined}
              onValueChange={(value) =>
                setParameter("program", value === "__all__" ? undefined : value)
              }
              disabled={isLoading || loadingPrograms}
            >
              <SelectTrigger className="h-9 w-full">
                <SelectValue
                  placeholder={loadingPrograms ? "Loading programs..." : "All programs"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">All Programs</SelectItem>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={String(program.title)}>
                    {program.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* STATUS */}
          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Status
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
                <SelectItem value="__all__">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Started At
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <DatepickerField
              id="started_at"
              placeholder="Select start date"
              value={searchParameters.get("started_at") ?? undefined}
              onChange={(value: string | Date | undefined) =>
                setParameter(
                  "started_at",
                  value
                    ? value instanceof Date
                      ? value.toISOString().split("T")[0]
                      : value
                    : undefined,
                )
              }
              disabled={isLoading}
            />
          </div>

          <DropdownMenuLabel className="text-muted-foreground text-xs font-semibold">
            Ended At
          </DropdownMenuLabel>
          <div className="px-2 py-1.5">
            <DatepickerField
              id="ended_at"
              placeholder="Select end date"
              value={searchParameters.get("ended_at") ?? undefined}
              onChange={(value: string | Date | undefined) =>
                setParameter(
                  "ended_at",
                  value
                    ? value instanceof Date
                      ? value.toISOString().split("T")[0]
                      : value
                    : undefined,
                )
              }
              disabled={isLoading}
            />
          </div>

          <DropdownMenuSeparator />

          {/* RESET */}
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
