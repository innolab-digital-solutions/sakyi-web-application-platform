"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CopyIcon, SquarePen, Star, StarHalf } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

import TestimonialDeletionDialog from "@/components/admin/features/testimonials/testimonial-deletion-dialog";
import TestimonialForm from "@/components/admin/features/testimonials/testimonial-form";
import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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

function CopyEnrollmentCode({ enrollmentCode }: { enrollmentCode: string | undefined }) {
  const [copied, setCopied] = useState(false);

  if (!enrollmentCode) return;

  return (
    <TooltipProvider>
      <Tooltip open={copied ? true : undefined} onOpenChange={(o) => !o && setCopied(false)}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="text-muted-foreground hover:text-primary ml-1 cursor-pointer transition"
            aria-label="Copy enrollment code"
            onClick={async (event) => {
              event.stopPropagation();
              if (enrollmentCode) {
                await navigator.clipboard.writeText(enrollmentCode);
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

export const testimonialsTableColumns: ColumnDef<Testimonial>[] = [
  {
    accessorKey: "enrollment",
    header: () => "Enrollment",
    cell: ({ row }) => (
      <div className="text-foreground flex items-center gap-1 text-[13px] font-semibold">
        {row.original.enrollment?.code ?? "-"}
        <CopyEnrollmentCode enrollmentCode={row.original.enrollment?.code ?? undefined} />
      </div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "reviewer",
    header: () => "Reviewer",
    cell: ({ row }) => {
      const client = row.original.enrollment?.client;

      return (
        <div className="flex items-center gap-2">
          <div>
            <Avatar>
              <AvatarImage
                src={client?.picture ?? undefined}
                alt={client?.name ?? "Client avatar"}
              />
              <AvatarFallback>{client?.name?.[0] ?? "C"}</AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-neutral-800">
              {client?.name ?? "Unknown client"}
            </div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "reviewed program",
    header: () => "Reviewed Program",
    cell: ({ row }) => {
      const program = row.original.enrollment?.program;

      return (
        <div className="flex items-center gap-2">
          <div>
            <Avatar className="size-12 rounded-md">
              <AvatarImage
                src={program?.thumbnail ?? undefined}
                alt={program?.title ?? "Program thumbnail"}
                className="object-cover"
              />
              <AvatarFallback className="border-muted size-12 rounded-md border bg-gray-100">
                <Image src="/images/no-image.png" alt="No image" width={32} height={32} />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium text-neutral-800">
              {program?.title ?? "Unknown program"}
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
