"use client";

import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import { Archive, CalendarDays, CheckCircle, Ellipsis, FileEdit, SquarePen } from "lucide-react";
import Link from "next/link";
import React from "react";

import OnboardingFormDeletionDialog from "@/components/admin/features/onboarding-forms/onboarding-form-deletion-dialog";
import OnboardingFormStatusDialog from "@/components/admin/features/onboarding-forms/onboarding-form-status-dialog";
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
import { PATHS } from "@/config/paths";
import { OnboardingForm } from "@/types/admin/onboarding-form";
import { cn } from "@/utils/shared/cn";

import OnboardingFormStatusSwitch from "./onboarding-form-status-switch";

const statusMeta: Record<
  OnboardingForm["status"],
  {
    variant: "secondary";
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    label: string;
    badgeClass: string;
    iconClass: string;
  }
> = {
  draft: {
    variant: "secondary",
    icon: FileEdit,
    label: "Draft",
    badgeClass: "bg-yellow-100 text-yellow-700",
    iconClass: "text-yellow-700 h-3.5 w-3.5",
  },
  published: {
    variant: "secondary",
    icon: CheckCircle,
    label: "Published",
    badgeClass: "bg-green-100 text-green-700",
    iconClass: "text-green-700 h-3.5 w-3.5",
  },
  archived: {
    variant: "secondary",
    icon: Archive,
    label: "Archived",
    badgeClass: "bg-slate-100 text-slate-700",
    iconClass: "text-slate-700 h-3.5 w-3.5",
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
              variant={meta.variant}
              className={cn(
                meta.badgeClass,
                "pointer-events-none flex items-center gap-1 !font-semibold",
              )}
            >
              <Icon className={meta.iconClass} />
              <span>{meta.label}</span>
            </Badge>
          </div>
          <div className="text-muted-foreground max-w-full break-words whitespace-pre-line">
            {description}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => "Publish ?",
    cell: ({ row }) => {
      const form = row.original;
      return (
        <div className="flex items-center justify-start">
          {form.status === "archived" ? (
            <span className="text-muted-foreground text-sm font-medium">-</span>
          ) : (
            <OnboardingFormStatusSwitch onboardingForm={form} />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "published_at",
    header: ({ column }) => <SortableHeader column={column}>Published At</SortableHeader>,
    cell: ({ row }) => {
      const publishedAt = row.getValue("published_at") as string | null;
      if (!publishedAt) {
        return (
          <Badge
            variant="outline"
            className="bg-muted/60 text-muted-foreground border-dashed !font-semibold"
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
              className="hover:!text-foreground ml-auto size-8 cursor-pointer items-center justify-center hover:!bg-gray-100"
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
              {(() => {
                const isEditable = Boolean(form.actions?.editable);
                const disabledReason = isEditable
                  ? undefined
                  : "You don't have permission to edit this onboarding form.";
                return (
                  <DisabledTooltip reason={disabledReason}>
                    <Button
                      asChild
                      variant="outline"
                      className="hover:!bg-accent/10 group hover:!text-accent hover:!ring-none flex w-full !cursor-pointer items-center justify-start gap-1.5 !border-none text-sm font-medium text-gray-700 shadow-none"
                      aria-label="Edit onboarding form"
                      disabled={!isEditable}
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
            <DropdownMenuItem asChild>
              <OnboardingFormStatusDialog onboardingForm={form} />
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
