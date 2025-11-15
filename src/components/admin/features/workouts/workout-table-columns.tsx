"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Flame, Gauge, PlayCircle, SquarePen } from "lucide-react";
import NextImage from "next/image";
import React from "react";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Workout } from "@/types/admin/workout";
import { cn } from "@/utils/shared/cn";

import { ImagePreview } from "../../shared/image-preview";
import WorkoutDeletionDialog from "./workout-deletion-dialog";
import WorkoutForm from "./workout-form";

// Map difficulty to badge styles
const difficultyMeta: Record<
  Workout["difficulty"],
  {
    label: string;
    badgeClass: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    iconClass: string;
  }
> = {
  beginner: {
    label: "Beginner",
    badgeClass: "bg-green-100 text-green-700",
    icon: CheckCircle,
    iconClass: "text-green-700 h-3.5 w-3.5",
  },
  intermediate: {
    label: "Intermediate",
    badgeClass: "bg-yellow-100 text-yellow-700",
    icon: Gauge,
    iconClass: "text-yellow-700 h-3.5 w-3.5",
  },
  advanced: {
    label: "Advanced",
    badgeClass: "bg-red-100 text-red-700",
    icon: Flame,
    iconClass: "text-red-700 h-3.5 w-3.5",
  },
};
export const workoutsTableColumns: ColumnDef<Workout>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
    cell: ({ row }) => <span className="text-sm font-semibold">{row.original.name}</span>,
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const difficulty = difficultyMeta[row.original.difficulty];
      return (
        <Badge
          variant="secondary"
          className={cn(difficulty.badgeClass, "flex items-center gap-1 font-semibold")}
        >
          <difficulty.icon className={difficulty.iconClass} />
          <span>{difficulty.label}</span>
        </Badge>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <span className="text-sm">{row.original.category?.name}</span>,
  },
  {
    accessorKey: "equipment",
    header: "Equipment",
    cell: ({ row }) => <span className="text-sm">{row.original.equipment ?? "-"}</span>,
  },
  {
    accessorKey: "gif",
    header: "GIF",
    cell: ({ row }) => {
      const gifUrl = row.original.gif
        ? row.original.gif.startsWith("http")
          ? row.original.gif
          : `/${row.original.gif}`
        : "";
      return (
        <div className="bg-muted/50 ring-muted-foreground/5 relative h-12 w-12 shrink-0 overflow-hidden rounded-md ring-1">
          {gifUrl ? (
            <ImagePreview src={gifUrl} fallback="N/A" alt="GIF" type="GIF" />
          ) : (
            <div className="text-muted-foreground/50 flex h-full w-full items-center justify-center text-xs font-medium">
              N/A
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "video",
    header: "Video",
    cell: ({ row }) => {
      const videoUrl = row.original.video;

      if (!videoUrl) {
        return <div className="text-muted-foreground/50 text-xs font-medium">N/A</div>;
      }

      // Extract YouTube video ID
      const videoIdMatch = videoUrl.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
      );
      const videoId = videoIdMatch ? videoIdMatch[1] : undefined;

      if (!videoId) {
        return <div className="text-muted-foreground/50 text-xs font-medium">Invalid URL</div>;
      }

      const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

      return (
        <a
          href={videoUrl}
          target="_blank"
          rel="noreferrer"
          className="ring-muted-foreground/5 relative block h-12 w-20 overflow-hidden rounded-md ring-1 transition hover:brightness-90"
        >
          <NextImage src={thumbnailUrl} alt="Video thumbnail" fill className="object-cover" />

          {/* Play overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="h-5 w-5 text-white drop-shadow-lg" />
          </div>
        </a>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const workout = row.original;

      return (
        <div className="flex items-center space-x-0.5">
          <WorkoutForm
            mode="edit"
            defaultValues={workout}
            trigger={(() => {
              const isEditable = Boolean(workout.actions?.editable);
              const disabledReason = isEditable
                ? undefined
                : "You don't have permission to edit this workout.";
              return (
                <DisabledTooltip reason={disabledReason}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:bg-accent/10 hover:text-accent flex cursor-pointer items-center justify-center text-sm font-semibold"
                    disabled={!isEditable}
                  >
                    <SquarePen className="h-2 w-2" />
                    <span>Edit</span>
                  </Button>
                </DisabledTooltip>
              );
            })()}
          />

          <WorkoutDeletionDialog workout={workout} />
        </div>
      );
    },
  },
];
