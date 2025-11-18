"use client";

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import Image from "next/image";
import React, { useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

interface ImagePreviewProperties {
  src?: string;
  alt?: string;
  fallback?: string;
  type?: string;
}

export function ImagePreview({
  src,
  alt = "Preview",
  fallback = "N/A",
  type,
}: ImagePreviewProperties) {
  const [preview, setPreview] = useState<string | undefined>();

  if (!src) {
    return (
      <div
        className="text-muted-foreground/50 ring-muted-foreground/5 bg-muted/50 flex h-12 w-12 items-center justify-center rounded-md text-xs font-medium ring-1"
        title={type}
      >
        {fallback}
      </div>
    );
  }

  return (
    <>
      <div
        className="ring-muted-foreground/5 bg-muted/50 relative h-12 w-12 shrink-0 cursor-pointer overflow-hidden rounded-md ring-1"
        onClick={() => setPreview(src)}
        title={type}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="rounded-md object-cover"
          sizes="(max-width: 768px) 48px, 48px"
          unoptimized={src.startsWith("http")}
        />
      </div>

      <Dialog open={!!preview} onOpenChange={() => setPreview(undefined)}>
        <DialogContent className="max-w-fit border-none bg-transparent shadow-none">
          <DialogTitle>
            <VisuallyHidden>{alt} Preview</VisuallyHidden>
          </DialogTitle>
          {preview && (
            <Image
              src={preview}
              alt={alt}
              width={500}
              height={500}
              className="rounded-lg object-contain"
              unoptimized={preview.startsWith("http")}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
