"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, Flame, Gauge, PlayCircle, SquarePen, Weight } from "lucide-react";
import Image from "next/image";
import React from "react";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

// Helper function to detect video source type
const getVideoSource = (url: string) => {
  // YouTube detection
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeMatch) {
    return {
      type: "youtube" as const,
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`,
    };
  }

  // Vimeo detection
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return {
      type: "vimeo" as const,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      thumbnailUrl: undefined,
    };
  }

  // Direct video file (mp4, webm, etc.)
  // eslint-disable-next-line security/detect-unsafe-regex
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)) {
    return {
      type: "direct" as const,
      embedUrl: url,
      thumbnailUrl: undefined,
    };
  }

  // Generic URL (could be any video platform)
  return {
    type: "generic" as const,
    embedUrl: url,
    thumbnailUrl: undefined,
  };
};

export const workoutsTableColumns: ColumnDef<Workout>[] = [
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
          <div className="text-muted-foreground max-w-full wrap-break-word whitespace-pre-line">
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
    accessorKey: "gif",
    header: "GIF",
    cell: ({ row }) => {
      const workout = row.original;

      return (
        <Dialog>
          <DialogTrigger asChild>
            <button type="button" className="cursor-pointer">
              <Avatar className="size-12 rounded-md">
                <AvatarImage src={workout.gif} alt={workout.name} className="object-cover" />
                <AvatarFallback className="border-muted size-12 rounded-md border bg-gray-100">
                  <Image src="/images/no-image.png" alt="No image" width={32} height={32} />
                </AvatarFallback>
              </Avatar>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-foreground text-sm font-bold">
                {workout.name} — GIF Preview
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs font-medium">
                View the animated demonstration of this workout exercise.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-muted relative aspect-video w-full overflow-hidden rounded-md">
              {workout.gif ? (
                <Image
                  src={workout.gif}
                  alt={`${workout.name} workout GIF`}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <div className="text-muted-foreground text-center">
                    <p className="text-sm font-medium">No GIF available</p>
                    <p className="text-xs">This workout doesn&apos;t have a demonstration GIF.</p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      );
    },
  },
  {
    accessorKey: "video",
    header: "Video",
    cell: ({ row }) => {
      const workout = row.original;
      const videoUrl = workout.video;

      if (!videoUrl) {
        return <div className="text-muted-foreground/50 text-xs font-medium">N/A</div>;
      }

      const videoSource = getVideoSource(videoUrl);

      return (
        <Dialog>
          <DialogTrigger asChild>
            <button type="button" className="cursor-pointer">
              <Avatar className="relative size-12 overflow-hidden rounded-md">
                {videoSource.thumbnailUrl ? (
                  <AvatarImage
                    src={videoSource.thumbnailUrl}
                    alt={`${workout.name} video thumbnail`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="border-muted size-12 rounded-md border bg-gray-100">
                    <PlayCircle className="text-muted-foreground h-6 w-6" />
                  </AvatarFallback>
                )}
                <div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/20">
                  <PlayCircle className="h-5 w-5 text-white drop-shadow-lg" />
                </div>
              </Avatar>
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-foreground text-sm font-bold">
                {workout.name} — Video Preview
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs font-medium">
                Watch the video demonstration of this workout exercise.
              </DialogDescription>
            </DialogHeader>
            <div className="relative aspect-video w-full overflow-hidden rounded-md bg-black">
              {videoSource.type === "youtube" || videoSource.type === "vimeo" ? (
                <iframe
                  src={videoSource.embedUrl}
                  title={`${workout.name} workout video`}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : videoSource.type === "direct" ? (
                <video
                  src={videoSource.embedUrl}
                  controls
                  className="h-full w-full"
                  title={`${workout.name} workout video`}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-6">
                  <PlayCircle className="text-muted-foreground/50 h-12 w-12" />
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm font-medium">
                      Video link available
                    </p>
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 mt-2 inline-block text-sm underline"
                    >
                      Open video in new tab
                    </a>
                  </div>
                </div>
              )}
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

      const editAllowed = Boolean(workout.actions?.edit?.allowed);
      const editReasons = workout.actions?.edit?.reasons ?? [];
      const editDisabledReason =
        editAllowed || editReasons.length === 0 ? undefined : editReasons[0]?.trim() || undefined;

      return (
        <div className="flex items-center space-x-0.5">
          <WorkoutForm
            mode="edit"
            defaultValues={workout}
            trigger={(() => {
              return (
                <DisabledTooltip reason={editDisabledReason}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:bg-accent/10 hover:text-accent flex cursor-pointer items-center justify-center text-sm font-semibold"
                    disabled={!editAllowed}
                    aria-label="Edit workout"
                  >
                    <SquarePen className="h-4 w-4" />
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
