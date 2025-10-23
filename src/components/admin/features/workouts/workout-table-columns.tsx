"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { SquarePen } from "lucide-react";
import Image from "next/image";
import React from "react";

import WorkoutDeletionDialog from "@/components/admin/features/workouts/workout-deletion-dialog";
import WorkoutForm from "@/components/admin/features/workouts/workout-form";
import SortableHeader from "@/components/shared/table/sortable-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Workout } from "@/types/admin/workout";

const demoGifs = [
  "https://media.giphy.com/media/3o7aD2saalBwwftBIY/giphy.gif",
  "https://media.giphy.com/media/l0HlOvJ7yaacpuSas/giphy.gif",
  "https://media.giphy.com/media/xT0GqssRweIhlz209i/giphy.gif",
  "https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif",
  "https://media.giphy.com/media/3o6MbrZ5zV1NLScuDe/giphy.gif",
];

export const workoutTableColumns: ColumnDef<Workout>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <SortableHeader column={column}>Workout</SortableHeader>,
    cell: ({ row }) => {
      return (
        <div className="flex flex-row">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-foreground text-sm font-semibold">
                {row.getValue("name") as string}
              </span>
            </div>
            <div className="text-muted-foreground max-w-[450px] truncate break-words whitespace-pre-line">
              {row.original.description || "-"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "gif_path",
    header: "GIF",
    cell: ({ row }) => {
      const gif = demoGifs[row.index % demoGifs.length] || (row.original.gif_path as string);

      return (
        <Image
          src={gif}
          alt="Workout GIF"
          width={100}
          height={100}
          className="rounded object-cover"
          unoptimized
        />
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <span>{row.original.category?.name ?? "-"}</span>,
  },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => {
      const difficulty = row.getValue("difficulty") as string;
      const colors =
        difficulty === "beginner"
          ? "bg-green-100 text-green-800"
          : difficulty === "intermediate"
            ? "bg-yellow-100 text-yellow-800"
            : "bg-red-100 text-red-800";

      return (
        <Badge variant="secondary" className={`px-2 py-0.5 text-xs !font-semibold ${colors}`}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </Badge>
      );
    },
  },

  {
    accessorKey: "video_url",
    header: "Video",
    cell: ({ row }) =>
      row.getValue("video_url") ? (
        <a
          href={row.getValue("video_url") as string}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-blue-500 underline"
        >
          Watch
        </a>
      ) : (
        "-"
      ),
  },
  {
    accessorKey: "equipment",
    header: "Equipment",
    cell: ({ row }) => <span>{row.getValue("equipment") || "-"}</span>,
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const workout = row.original;

      return (
        <div className="flex items-center space-x-1">
          <WorkoutForm
            mode="edit"
            defaultValues={workout}
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-accent/10 hover:text-accent text-accent flex items-center gap-1 text-sm font-semibold"
              >
                <SquarePen className="h-3 w-3" />
                Edit
              </Button>
            }
          />
          <WorkoutDeletionDialog workout={workout} />
        </div>
      );
    },
  },
];
