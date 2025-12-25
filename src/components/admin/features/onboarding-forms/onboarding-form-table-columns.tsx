"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import {
  CalendarDays,
  CheckCircle,
  ClipboardList,
  Ellipsis,
  SquarePen,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import React from "react";

import OnboardingFormArchiveButton from "@/components/admin/features/onboarding-forms/onboarding-form-archive-button";
import OnboardingFormDeletionDialog from "@/components/admin/features/onboarding-forms/onboarding-form-deletion-dialog";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
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
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { PATHS } from "@/config/paths";
import { OnboardingForm } from "@/types/admin/onboarding-form";
import { cn } from "@/utils/shared/cn";

const statusMeta: Record<
  OnboardingForm["status"],
  {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    badgeClass: string;
    iconClass: string;
  }
> = {
  draft: {
    label: "Draft",
    badgeClass: "bg-yellow-100 text-yellow-700",
    icon: ClipboardList,
    iconClass: "text-yellow-700 h-3.5 w-3.5",
  },
  published: {
    label: "Published",
    badgeClass: "bg-green-100 text-green-700",
    icon: CheckCircle,
    iconClass: "text-green-700 h-3.5 w-3.5",
  },
  archived: {
    label: "Archived",
    badgeClass: "bg-red-100 text-red-700",
    icon: XCircle,
    iconClass: "text-red-700 h-3.5 w-3.5",
  },
};

export const onboardingFormsTableColumns: ColumnDef<OnboardingForm>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <SortableHeader column={column}>Form</SortableHeader>,
    cell: ({ row }) => {
      const title = row.getValue("title") as string;
      const form = row.original;
      const description = form.description || "-";

      const meta = statusMeta[form.status];
      const Icon = meta.icon;

      return (
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-foreground text-sm font-semibold">{title}</span>
            <Badge
              variant="secondary"
              className={cn(
                meta.badgeClass,
                "pointer-events-none flex items-center gap-1 font-semibold!",
              )}
            >
              <Icon className={meta.iconClass} />
              <span>{meta.label}</span>
            </Badge>
          </div>
          <div className="text-muted-foreground line-clamp-1 max-w-full wrap-break-word whitespace-pre-line">
            {description}
          </div>
        </div>
      );
    },
  },
  {
    id: "attached_programs",
    header: () => "Attached Programs",
    cell: ({ row }) => {
      const form = row.original;
      const programs = form.programs ?? [];

      if (programs.length === 0) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed text-[13px] font-semibold"
          >
            <ClipboardList className="h-3.5 w-3.5" />
            <span className="ml-1">No programs</span>
          </Badge>
        );
      }

      const programCount = programs.length;

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex cursor-help items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-primary/15 text-primary flex max-w-[140px] cursor-help items-center gap-1 truncate text-[13px] font-semibold! capitalize"
              >
                <ClipboardList className="text-primary h-3.5 w-3.5" />
                <span className="ml-1">Programs ({programCount})</span>
              </Badge>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-popover text-popover-foreground border-border rounded-md border px-3 py-2 shadow-lg">
            <div className="space-y-1">
              <p className="text-xs font-semibold">Attached Programs:</p>
              <ul className="list-inside list-disc space-y-1 text-xs">
                {programs.map((program) => (
                  <li key={program.id}>
                    <Link
                      href={PATHS.ADMIN.PROGRAMS.PREVIEW(program.slug)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:underline"
                      onClick={(event_) => event_.stopPropagation()}
                    >
                      {program.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </TooltipContent>
        </Tooltip>
      );
    },
  },
  {
    accessorKey: "published_at",
    header: () => "Published At",
    cell: ({ row }) => {
      const publishedAt = row.getValue("published_at") as string | null;
      if (!publishedAt) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed text-[13px] font-semibold"
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="ml-1">Not published</span>
          </Badge>
        );
      }

      const formatted = dayjs(publishedAt).isValid()
        ? dayjs(publishedAt).format("DD-MMMM-YYYY")
        : publishedAt;

      return <div className="text-foreground text-sm font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const form = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              aria-label="Open actions"
              className="hover:text-foreground! ml-auto size-8 cursor-pointer items-center justify-center hover:bg-gray-100!"
            >
              <Ellipsis className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8} className="p-3.5">
            <DropdownMenuLabel className="text-muted-foreground text-[13px] font-semibold">
              Onboarding Form Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <OnboardingFormArchiveButton onboardingForm={form} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              {(() => {
                const editAllowed = Boolean(form.actions?.edit?.allowed);
                const editReasons = form.actions?.edit?.reasons ?? [];
                const editDisabledReason =
                  editAllowed || editReasons.length === 0
                    ? undefined
                    : editReasons[0]?.trim() || undefined;
                return (
                  <DisabledTooltip reason={editDisabledReason}>
                    <Button
                      asChild
                      variant="outline"
                      className="hover:bg-accent/10! group hover:text-accent! hover:ring-none! flex w-full cursor-pointer! items-center justify-start gap-1.5 border-none! text-sm font-medium text-gray-700 shadow-none"
                      aria-label="Edit onboarding form"
                      disabled={!editAllowed}
                    >
                      <Link href={PATHS.ADMIN.ONBOARDING_FORMS.EDIT(form.id)}>
                        <SquarePen className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
                        <span>Edit Form</span>
                      </Link>
                    </Button>
                  </DisabledTooltip>
                );
              })()}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <OnboardingFormDeletionDialog onboardingForm={form} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
