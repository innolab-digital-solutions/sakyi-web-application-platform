"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Flame, Gauge, PlayCircle, SquarePen, Weight } from "lucide-react";
import Image from "next/image";
import React from "react";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Workout } from "@/types/admin/workout";
import { cn } from "@/utils/shared/cn";

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
    accessorKey: "gif",
    header: "GIF",
    cell: ({ row }) => {
      const gifUrl = row.original.gif
        ? row.original.gif.startsWith("http")
          ? row.original.gif
          : `/${row.original.gif}`
        : "";
      if (!gifUrl) {
        return <div className="text-muted-foreground/50 text-xs font-medium">N/A</div>;
      }

      return (
        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="ring-muted-foreground/5 relative h-12 w-12 shrink-0 overflow-hidden rounded-md ring-1 transition hover:brightness-95"
            >
              <Image src={gifUrl} alt="Workout GIF" fill className="object-cover" />
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Workout GIF preview</DialogTitle>
            </DialogHeader>
            <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-md">
              <Image src={gifUrl} alt="Workout GIF" fill className="object-contain" />
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Name</SortableHeader>,
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const description = row.original.description || "-";
      const difficulty = difficultyMeta[row.original.difficulty];

      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-foreground text-sm font-semibold">{name}</span>
            <Badge
              variant="secondary"
              className={cn(
                difficulty.badgeClass,
                "pointer-events-none flex items-center gap-1 font-semibold!",
              )}
            >
              <difficulty.icon className={difficulty.iconClass} />
              <span>{difficulty.label}</span>
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
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-neutral-800">{row.original.category?.name}</span>
    ),
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
      const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

      return (
        <Dialog>
          <DialogTrigger asChild>
            {thumbnailUrl ? (
              <button
                type="button"
                className="group border-muted-foreground/20 hover:ring-primary/30 relative flex h-14 w-24 items-center justify-center overflow-hidden rounded-lg border bg-white shadow-sm transition hover:ring-2 focus:outline-none"
              >
                <Image
                  src={thumbnailUrl}
                  alt="Workout video thumbnail"
                  fill
                  className="object-cover grayscale-[.15] transition group-hover:brightness-[.65]"
                  onError={(error) => {
                    // fallback to parent node for error state (hides image)
                    const parent = (error.target as HTMLElement).parentElement;
                    if (parent)
                      parent.innerHTML = `
                        <div class='flex h-full w-full items-center justify-center bg-muted-foreground/10'>
                          <span class='text-xs text-muted-foreground font-medium'>No Video</span>
                        </div>
                      `;
                  }}
                />
                <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span className="group-hover:bg-primary/85 flex h-10 w-10 items-center justify-center rounded-full bg-black/75 backdrop-blur-sm transition-colors duration-200">
                    <PlayCircle className="h-6 w-6 text-white drop-shadow" />
                  </span>
                </span>
              </button>
            ) : (
              <div className="border-muted-foreground/20 bg-muted/30 flex h-14 w-24 items-center justify-center rounded-lg border border-dashed">
                <span className="text-muted-foreground flex items-center gap-1 text-xs font-semibold">
                  <PlayCircle className="h-4 w-4" />
                  Video unavailable
                </span>
              </div>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle>Workout video</DialogTitle>
            </DialogHeader>
            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-black">
              <iframe
                src={embedUrl}
                title="Workout video"
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "equipment",
    header: "Equipment",
    cell: ({ row }) => {
      return row.original.equipment ? (
        <span className="text-sm font-medium text-neutral-800">{row.original.equipment}</span>
      ) : (
        <Badge
          variant="outline"
          className="bg-muted/60 text-muted-foreground pointer-events-none border-dashed text-[13px] font-semibold"
        >
          <Weight className="h-3.5 w-3.5" />
          <span className="ml-1">Not provided</span>
        </Badge>
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
