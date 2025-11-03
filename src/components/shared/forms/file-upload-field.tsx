/* eslint-disable unicorn/no-null */
"use client";

import { Upload, X } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/shared/cn";

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 B";
  const sizes = ["B", "KB", "MB", "GB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / 1024 ** index).toFixed(1)} ${sizes[index]}`;
};

const getAcceptDescription = (accept?: string) => {
  if (!accept) return "Any file type";

  // Handle common MIME types
  if (accept.includes("image/*")) return "Images (PNG, JPG, GIF, etc.)";
  if (accept.includes("video/*")) return "Videos (MP4, AVI, MOV, etc.)";
  if (accept.includes("audio/*")) return "Audio (MP3, WAV, etc.)";
  if (accept.includes("application/pdf")) return "PDF files";
  if (accept.includes("text/*")) return "Text files";

  // Handle specific extensions
  const extensions = accept
    .split(",")
    .map((extension) => extension.trim().replace(".", "").toUpperCase());
  if (extensions.length <= 3) {
    return extensions.join(", ");
  }

  // Handle multiple specific types
  if (accept.includes("image/")) {
    const imageTypes = accept.split(",").filter((type) => type.includes("image/"));
    if (imageTypes.length > 0) {
      return (
        "Images (" +
        imageTypes.map((type) => type.replace("image/", "").toUpperCase()).join(", ") +
        ")"
      );
    }
  }

  // Fallback to showing first few extensions
  return extensions.slice(0, 3).join(", ") + (extensions.length > 3 ? "..." : "");
};

export interface FileUploadFieldProperties {
  id: string;
  label?: React.ReactNode;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  // Value can be File, File[], string, or null/undefined
  value?: File | File[] | string | null;
  onChange?: (value: File | File[] | null) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number; // in bytes
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  inputClassName?: string;
}

export function FileUploadField({
  id,
  label,
  description,
  error,
  required = false,
  disabled = false,
  multiple = false,
  value,
  onChange,
  accept,
  maxFiles,
  maxSize,
  containerClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
}: FileUploadFieldProperties) {
  const inputReference = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrls, setPreviewUrls] = useState<Map<File, string>>(new Map());

  // Normalize value to array for easier handling
  const normalizedValue = React.useMemo(() => {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    if (typeof value === "string") return []; // URL strings are handled separately
    return [value];
  }, [value]);

  // Get existing URL if value is a string (and not empty)
  const existingUrl = typeof value === "string" && value.length > 0 ? value : undefined;

  // Create preview URLs for File objects
  React.useEffect(() => {
    const newPreviewUrls = new Map<File, string>();

    for (const file of normalizedValue) {
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        newPreviewUrls.set(file, url);
      }
    }

    // Clean up old URLs
    setPreviewUrls((previous) => {
      for (const url of previous.values()) {
        URL.revokeObjectURL(url);
      }
      return newPreviewUrls;
    });

    return () => {
      for (const url of newPreviewUrls.values()) {
        URL.revokeObjectURL(url);
      }
    };
  }, [normalizedValue]);

  const handleFileChange = useCallback(
    (files: FileList | null) => {
      if (!files || disabled) return;

      const fileArray = [...files];
      let filesToProcess = fileArray;

      // Check max files
      if (multiple && maxFiles && fileArray.length > maxFiles) {
        filesToProcess = fileArray.slice(0, maxFiles);
      }

      // Check file size
      if (maxSize) {
        filesToProcess = filesToProcess.filter((file) => file.size <= maxSize);
      }

      // Check accept types
      if (accept) {
        const acceptTypes = accept.split(",").map((type) => type.trim());
        filesToProcess = filesToProcess.filter((file) => {
          const fileType = file.type;
          const fileExtension = `.${file.name.split(".").pop()?.toLowerCase()}`;

          return acceptTypes.some((type) => {
            if (type === fileType) return true;
            if (type === fileExtension) return true;
            if (type.includes("/*") && fileType.startsWith(type.replace("/*", "/"))) return true;
            return false;
          });
        });
      }

      if (onChange) {
        if (multiple) {
          onChange(filesToProcess.length > 0 ? filesToProcess : null);
        } else {
          onChange(filesToProcess[0] || null);
        }
      }
    },
    [disabled, multiple, maxFiles, maxSize, accept, onChange],
  );

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      handleFileChange(event.target.files);
      // Reset input value to allow selecting the same file again
      if (inputReference.current) {
        inputReference.current.value = "";
      }
    },
    [handleFileChange],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      if (!disabled) {
        setDragOver(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragOver(false);
      if (!disabled) {
        handleFileChange(event.dataTransfer.files);
      }
    },
    [disabled, handleFileChange],
  );

  const handleRemove = useCallback(
    (fileToRemove: File) => {
      if (onChange) {
        if (multiple) {
          const newFiles = normalizedValue.filter((file) => file !== fileToRemove);
          onChange(newFiles.length > 0 ? newFiles : null);
        } else {
          onChange(null);
        }
      }
    },
    [onChange, multiple, normalizedValue],
  );

  const handleClear = useCallback(() => {
    if (onChange) {
      onChange(null);
    }
    // Reset the input element
    if (inputReference.current) {
      inputReference.current.value = "";
    }
  }, [onChange]);

  const handleClick = useCallback(() => {
    if (!disabled && inputReference.current) {
      inputReference.current.click();
    }
  }, [disabled]);

  const hasError = Boolean(error);
  // Only show files if value is actually present (not null, undefined, or empty)
  const hasFiles = normalizedValue.length > 0 || Boolean(existingUrl);
  const isSingleMode = !multiple;
  const singleFile = isSingleMode && normalizedValue.length > 0 ? normalizedValue[0] : null;

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return "🖼️";
    if (file.type.startsWith("video/")) return "🎥";
    if (file.type.startsWith("audio/")) return "🎵";
    if (file.type.startsWith("text/")) return "📄";
    return "📁";
  };

  return (
    <div className={cn("space-y-2", containerClassName)}>
      {label && (
        <Label
          htmlFor={id}
          className={cn(
            "text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            labelClassName,
          )}
        >
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-label="required">
              *
            </span>
          )}
        </Label>
      )}

      {/* Dropzone */}
      <div
        className={cn(
          "relative flex min-h-[88px] cursor-pointer items-center gap-3 overflow-hidden rounded-md border-2 border-dashed bg-neutral-50 px-4 py-3 transition-colors",
          "focus-visible:border-ring/50 hover:bg-neutral-100",
          dragOver && "border-primary/30 bg-accent/30",
          hasError && "border-red-500 !bg-red-50",
          disabled && "cursor-not-allowed opacity-50",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        aria-label="Upload file"
      >
        {/* Minimal inline prompt */}
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded border">
            <Upload className="text-muted-foreground size-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {dragOver
                ? multiple
                  ? "Drop files to upload"
                  : "Drop file to upload"
                : multiple
                  ? "Click or drag files to upload"
                  : "Click or drag a file to upload"}
            </span>
            <span className="text-muted-foreground text-xs font-semibold">
              {getAcceptDescription(accept)} · Max {maxSize ? formatFileSize(maxSize) : "2MB"}
            </span>
          </div>
        </div>
      </div>

      {description && (
        <p
          className={cn("text-muted-foreground text-sm", descriptionClassName)}
          id={`${id}-description`}
        >
          {description}
        </p>
      )}

      {/* Previews for both single and multiple */}
      {hasFiles && (
        <div className="space-y-2">
          {/* Existing URL preview */}
          {existingUrl && normalizedValue.length === 0 && (
            <div className="relative flex items-center gap-2.5 rounded-md border p-3">
              <div className="bg-accent/50 relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border">
                {existingUrl && (
                  <Image
                    src={existingUrl}
                    alt="Current image"
                    fill
                    className="object-cover"
                    unoptimized={existingUrl.startsWith("blob:")}
                  />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">Current image</span>
                <span className="text-muted-foreground truncate text-xs">Existing file</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                onClick={handleClear}
                disabled={disabled}
              >
                <X />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          )}

          {/* File previews */}
          {normalizedValue.map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${index}`}
              className="relative flex items-center gap-2.5 rounded-md border p-3"
            >
              <div className="bg-accent/50 relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded border">
                {file.type.startsWith("image/") ? (
                  previewUrls.get(file) ? (
                    <Image
                      src={previewUrls.get(file) || ""}
                      alt={file.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-2xl">{getFileIcon(file)}</span>
                  )
                ) : (
                  <span className="text-2xl">{getFileIcon(file)}</span>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">{file.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {formatFileSize(file.size)}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                onClick={() => handleRemove(file)}
                disabled={disabled}
              >
                <X />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          ))}
        </div>
      )}

      {hasError && (
        <p
          className={cn(
            "animate-in slide-in-from-top-1 text-sm font-medium text-red-600",
            errorClassName,
          )}
          id={`${id}-error`}
          role="alert"
        >
          {error}
        </p>
      )}

      <input
        ref={inputReference}
        type="file"
        id={id}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
      />
    </div>
  );
}

export default FileUploadField;
