"use client";

import { ColumnDef } from "@tanstack/react-table";
import { SquarePen, Star, StarHalf } from "lucide-react";
import React from "react";

import TestimonialDeletionDialog from "@/components/admin/features/testimonials/testimonial-deletion-dialog";
import TestimonialForm from "@/components/admin/features/testimonials/testimonial-form";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Testimonial } from "@/types/admin/testimonial";

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
    accessorKey: "reviewer",
    header: () => "Reviewer",
    cell: ({ row }) => {
      const reviewer = row.original.reviewer;

      return (
        <div className="flex items-center gap-2">
          <div>
            <Avatar>
              <AvatarImage
                src={reviewer?.picture ?? undefined}
                alt={reviewer?.name ?? "Reviewer avatar"}
              />
              <AvatarFallback>{reviewer?.name?.[0] ?? "C"}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-neutral-800">
              {reviewer?.name ?? "Unknown reviewer"}
            </div>
          </div>
        </div>
      );
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
          <Badge
            variant="secondary"
            className="ml-1 bg-yellow-100 text-xs font-semibold text-yellow-700"
          >
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
      <div className="line-clamp-1 max-w-full text-sm font-medium wrap-break-word whitespace-pre-line text-neutral-800">
        {row.original.comment}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    header: "Actions",
    cell: ({ row }) => {
      const testimonial = row.original;

      const editAllowed = Boolean(testimonial.actions?.edit?.allowed);
      const editReasons = testimonial.actions?.edit?.reasons ?? [];
      const editDisabledReason =
        editAllowed || editReasons.length === 0 ? undefined : editReasons[0]?.trim() || undefined;

      return (
        <div className="flex items-center space-x-0.5">
          {/* Edit Button */}
          <TestimonialForm
            mode="edit"
            defaultValues={testimonial}
            trigger={(() => {
              return (
                <DisabledTooltip reason={editDisabledReason}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-accent hover:bg-accent/10 hover:text-accent flex cursor-pointer items-center justify-center text-sm font-semibold"
                    disabled={!editAllowed}
                    aria-label="Edit testimonial"
                  >
                    <SquarePen className="h-4 w-4" />
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
