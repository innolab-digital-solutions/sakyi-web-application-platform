"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Activity, CalendarDays, CopyIcon, Phone } from "lucide-react";
import { useState } from "react";

import SortableHeader from "@/components/shared/table/sortable-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Client } from "@/types/admin/client";

// Helper to extract the current active enrollment
function getCurrentActiveEnrollment(enrollments: Client["enrollments"]) {
  return enrollments?.find((en) => en.status === "active");
}

function CopyPublicId({ publicId }: { publicId: string | undefined }) {
  const [copied, setCopied] = useState(false);

  if (!publicId) return;

  return (
    <TooltipProvider>
      <Tooltip open={copied ? true : undefined} onOpenChange={(o) => !o && setCopied(false)}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="text-muted-foreground hover:text-primary ml-1 cursor-pointer transition"
            aria-label="Copy public id"
            onClick={async (event) => {
              event.stopPropagation();
              if (publicId) {
                await navigator.clipboard.writeText(publicId);
                setCopied(true);
                setTimeout(() => setCopied(false), 1200);
              }
            }}
          >
            <CopyIcon size={16} />
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-popover text-popover-foreground border-border rounded-md border px-3 py-2 shadow-lg">
          {copied ? "Copied!" : "Copy"}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const clientsTableColumns: ColumnDef<Client>[] = [
  {
    accessorKey: "public_id",
    header: ({ column }) => <SortableHeader column={column}>Public ID</SortableHeader>,
    cell: ({ row }) => (
      <div className="text-foreground flex items-center gap-1 text-[13px] font-semibold">
        {row.original.public_id ?? "-"}
        <CopyPublicId publicId={row.original.public_id ?? undefined} />
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Client</SortableHeader>,
    cell: ({ row }) => {
      const client = row.original;
      const profile = client.profile;
      const enrollments = client.enrollments ?? [];
      const activeEnrollment = getCurrentActiveEnrollment(enrollments);

      const lastActivity = client.last_activity;
      const formatted =
        lastActivity && dayjs(lastActivity).isValid()
          ? dayjs(lastActivity).format("DD-MMMM-YYYY (hh:mm) A")
          : (lastActivity ?? "");

      return (
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage src={profile?.picture ?? ""} alt={profile?.name ?? "Client avatar"} />
            <AvatarFallback>{profile?.name?.[0] ?? "C"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="text-foreground text-sm font-semibold">
                {profile?.name ?? "Unknown client"}
              </span>
              {activeEnrollment && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary flex items-center gap-1 font-semibold"
                      >
                        <Activity className="h-3.5 w-3.5" />
                        <span>Active Enrollment</span>
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="bg-popover text-popover-foreground border-border rounded-md border px-3 py-2 shadow-lg">
                      <div className="flex flex-col gap-1">
                        <div className="text-foreground text-xs font-semibold">
                          {activeEnrollment.program?.title}
                        </div>
                        <div className="text-foreground text-xs font-medium">
                          Code:{" "}
                          <span className="text-primary font-medium">{activeEnrollment.code}</span>
                        </div>
                        <div className="text-foreground text-xs font-medium">
                          Assigned Team:{" "}
                          <span className="text-muted-foreground font-medium">
                            {activeEnrollment.team?.name}
                          </span>
                        </div>
                        <div className="text-foreground text-xs font-medium">
                          Started Date:{" "}
                          <span className="text-muted-foreground font-medium">
                            {dayjs(activeEnrollment.started_at).isValid()
                              ? dayjs(activeEnrollment.started_at).format("DD-MMMM-YYYY")
                              : activeEnrollment.started_at}
                          </span>
                        </div>
                        <div className="text-foreground text-xs font-medium">
                          Will End On:{" "}
                          <span className="text-muted-foreground font-medium">
                            {dayjs(activeEnrollment.ended_at).isValid()
                              ? dayjs(activeEnrollment.ended_at).format("DD-MMMM-YYYY")
                              : activeEnrollment.ended_at}
                          </span>
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <span className="text-muted-foreground text-xs font-semibold">
              Last Activity: {formatted ?? "-"}
            </span>
          </div>
        </div>
      );
    },
    enableHiding: false,
  },

  {
    accessorKey: "contact phone",
    header: "Contact Phone",
    cell: ({ row }) => {
      const phone = row.original.profile?.phone;

      return (
        <div className="flex items-center gap-2">
          {phone ? (
            <span className="text-sm font-medium text-neutral-800">{phone}</span>
          ) : (
            <Badge
              variant="outline"
              className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed text-[13px] font-semibold"
            >
              <Phone className="h-3.5 w-3.5" />
              <span className="ml-1">Not provided</span>
            </Badge>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "date of birth",
    header: "Date of Birth",
    cell: ({ row }) => {
      const dob = row.original.profile?.dob;
      const formattedDob =
        dob && dayjs(dob).isValid() ? dayjs(dob).format("DD-MMMM-YYYY") : (dob ?? "");

      let age: number | undefined;
      if (dob && dayjs(dob).isValid()) {
        const today = dayjs();
        const birthDate = dayjs(dob);
        age = today.diff(birthDate, "year");
      }

      return (
        <div className="flex items-center gap-2">
          {formattedDob ? (
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-neutral-800">{formattedDob}</span>
              <span className="text-muted-foreground text-xs font-semibold">
                Age: {age === undefined ? "Unknown" : `${age} ${age === 1 ? "Year" : "Years"}`}
              </span>
            </div>
          ) : (
            <Badge
              variant="outline"
              className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed text-[13px] font-semibold"
            >
              <CalendarDays className="h-3.5 w-3.5" />
              <span className="ml-1">Not provided</span>
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "focus",
    header: "Focus",
    cell: ({ row }) => {
      const focus = row.original.profile?.focus;
      const rawGoal = focus?.goal?.trim();
      const goal = rawGoal && rawGoal.length > 0 ? rawGoal : undefined;
      const interests = (focus?.interests ?? []).filter((value) => Boolean(value && value.trim()));

      if (!goal && interests.length === 0) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed text-[13px] font-semibold"
          >
            <span className="ml-1">Not specified</span>
          </Badge>
        );
      }

      const displayInterests = interests.slice(0, 2);
      const remainingCount = interests.length - displayInterests.length;

      return (
        <div className="flex max-w-md flex-col gap-0.5">
          {goal && (
            <span className="line-clamp-1 text-sm font-medium text-neutral-800" title={goal}>
              {goal}
            </span>
          )}
          {displayInterests.length > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex cursor-help gap-1">
                    {displayInterests.map((interest) => (
                      <Badge
                        key={interest}
                        variant="outline"
                        className="border-muted bg-muted/40 text-muted-foreground text-[11px] font-medium"
                      >
                        {interest}
                      </Badge>
                    ))}
                    {remainingCount > 0 && (
                      <Badge
                        variant="outline"
                        className="border-muted bg-muted/30 text-muted-foreground border-dashed text-[11px] font-medium"
                      >
                        +{remainingCount} more
                      </Badge>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-popover text-popover-foreground border-border max-w-xs rounded-md border px-3 py-2 text-xs shadow-lg">
                  <div className="space-y-1">
                    <div className="text-foreground text-[11px] font-semibold tracking-wide uppercase">
                      Interests
                    </div>
                    <div className="flex max-h-32 flex-wrap gap-1 overflow-y-auto pr-1">
                      {interests.map((interest) => (
                        <Badge
                          key={interest}
                          variant="outline"
                          className="border-muted bg-muted/40 text-muted-foreground px-2 py-0.5 text-[11px] font-medium"
                        >
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "enrollments",
    header: "Enrollments",
    cell: ({ row }) => {
      const enrollments = row.original.enrollments ?? [];

      if (enrollments.length === 0) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed text-[13px] font-semibold"
          >
            None
          </Badge>
        );
      }

      const activeCount = enrollments.filter((enrollment) => enrollment.status === "active").length;
      const completedCount = enrollments.filter(
        (enrollment) => enrollment.status === "completed",
      ).length;
      const cancelledCount = enrollments.filter(
        (enrollment) => enrollment.status === "cancelled",
      ).length;
      const pendingCount = enrollments.filter(
        (enrollment) => enrollment.status === "pending",
      ).length;

      const parts: string[] = [];
      if (activeCount > 0) parts.push(`${activeCount} active`);
      if (completedCount > 0) parts.push(`${completedCount} completed`);
      if (cancelledCount > 0) parts.push(`${cancelledCount} cancelled`);
      if (pendingCount > 0) parts.push(`${pendingCount} pending`);

      const summaryLine = parts.join(" · ");

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex cursor-help flex-col gap-0.5 text-sm font-medium text-neutral-800 capitalize">
                <span>
                  {enrollments.length} {enrollments.length === 1 ? "enrollment" : "enrollments"}
                </span>
                {summaryLine && (
                  <span className="text-muted-foreground text-xs font-medium capitalize">
                    {summaryLine}
                  </span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-popover text-popover-foreground border-border max-w-xs rounded-md border px-3 py-2 text-xs shadow-lg">
              <div className="space-y-2">
                <div className="text-foreground pt-1.5 text-xs font-semibold tracking-wide uppercase">
                  Enrollment codes
                </div>
                <Separator className="my-2" />
                <div className="space-y-0.5">
                  {enrollments.map((enrollment) => (
                    <div
                      key={enrollment.id}
                      className="flex items-center justify-between gap-2 text-[11px]"
                    >
                      <span className="text-foreground font-semibold">{enrollment.code}</span>
                      <span className="text-muted-foreground capitalize">{enrollment.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];
