"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Star, StarHalf } from "lucide-react";
import React from "react";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Testimonial } from "@/types/admin/testimonial";

import TestimonialDeletionDialog from "./testimonial-deletion-dialog";
import TestimonialForm from "./testimonial-form";

// Utility to render rating stars
function RatingStars({ rating }: { rating: number }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const totalStars = 5;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: fullStars }).map((_, index) => (
        <Star key={`full-${index}`} className="h-4 w-4 fill-yellow-500 text-yellow-500" />
      ))}
      {hasHalfStar && <StarHalf className="h-4 w-4 fill-yellow-500 text-yellow-500" />}
      {Array.from({ length: totalStars - fullStars - (hasHalfStar ? 1 : 0) }).map((_, index) => (
        <Star key={`empty-${index}`} className="text-muted-foreground/30 h-4 w-4" />
      ))}
    </div>
  );
}

export const testimonialsTableColumns: ColumnDef<Testimonial>[] = [
  {
    accessorKey: "enrollment.user.name",
    header: () => <span>User</span>,
    cell: ({ row }) => {
      const user = row.original.enrollment?.user?.name ?? "-";
      return <span className="text-sm font-medium">{user}</span>;
    },
  },
  {
    accessorKey: "enrollment.program.title",
    header: () => <span>Program</span>,
    cell: ({ row }) => {
      const program = row.original.enrollment?.program?.title ?? "-";
      return <span className="text-sm">{program}</span>;
    },
  },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => {
      const rawRating = row.original.rating;
      const rating = Number(rawRating) || 0;

      return (
        <div className="flex items-center gap-1">
          <RatingStars rating={rating} />
          <Badge variant="secondary" className="ml-1 bg-yellow-50 text-xs text-yellow-700">
            {rating.toFixed(1)}
          </Badge>
        </div>
      );
    },
  },

  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => (
      <span className="text-muted-foreground line-clamp-2 max-w-[300px] text-sm">
        {row.original.comment}
      </span>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const testimonial = row.original;

      return (
        <div className="flex items-center space-x-0.5">
          {/* Edit Button */}
          <TestimonialForm
            mode="edit"
            defaultValues={testimonial}
            trigger={(() => {
              const isEditable = Boolean(testimonial.actions?.editable);
              const disabledReason = isEditable
                ? undefined
                : "You don't have permission to edit this testimonial.";
              return (
                <DisabledTooltip reason={disabledReason}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:bg-accent/10 hover:text-accent flex cursor-pointer items-center justify-center text-sm font-semibold"
                    disabled={!isEditable}
                  >
                    <SquarePen className="h-3 w-3" />
                    <span>Edit</span>
                  </Button>
                </DisabledTooltip>
              );
            })()}
          />

          {/* Delete Button */}
          <TestimonialDeletionDialog testimonial={testimonial} />
        </div>
      );
    },
  },
];
