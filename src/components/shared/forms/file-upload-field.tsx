"use client";

import { ImagePlus, Upload, X } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadClear,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/shared/cn";

type Mode = "default" | "avatar";

export interface FileUploadFieldProperties {
  id: string;
  label?: React.ReactNode;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  multiple?: boolean;
  mode?: Mode;
  value?: File | File[] | null;
  defaultValue?: File[];
  onChange?: (value: File | File[] | null) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  onFileReject?: (file: File, message: string) => void;
  onFileAccept?: (file: File) => void;
  onAccept?: (files: File[]) => void;
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  dropzoneClassName?: string;
  listClassName?: string;
}

export function FileUploadField({
  id,
  label,
  description,
  error,
  required = false,
  disabled = false,
  multiple = false,
  mode = "default",
  value,
  defaultValue,
  onChange,
  accept,
  maxFiles,
  maxSize,
  onFileReject,
  onFileAccept,
  onAccept,
  containerClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  dropzoneClassName,
  listClassName,
}: FileUploadFieldProperties) {
  const isAvatar = mode === "avatar";
  const computedMultiple = isAvatar ? false : multiple;
  const computedAccept = accept ?? (isAvatar ? "image/*" : undefined);
  const computedMaxFiles = isAvatar ? 1 : maxFiles;

  // Normalize external value to File[] for the underlying component
  const normalizedValue = React.useMemo<File[] | undefined>(() => {
    if (value === undefined) return;
    if (value === null) return [];
    return Array.isArray(value) ? value : value ? [value] : [];
  }, [value]);

  const handleValueChange = React.useCallback(
    (files: File[]) => {
      if (!onChange) return;
      if (computedMultiple) {
        onChange(files);
      } else {
        onChange(files[0] ?? undefined);
      }
    },
    [onChange, computedMultiple],
  );

  const hasError = Boolean(error);

  // Avatar preview URL lifecycle must be managed via hooks at the top level
  const avatarFile = isAvatar ? normalizedValue?.[0] : undefined;
  const previewUrl = React.useMemo(
    () => (avatarFile ? URL.createObjectURL(avatarFile) : undefined),
    [avatarFile],
  );
  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (isAvatar) {
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

        {description && (
          <p
            className={cn("text-muted-foreground text-sm", descriptionClassName)}
            id={`${id}-description`}
          >
            {description}
          </p>
        )}

        <FileUpload
          id={id}
          className="w-full"
          value={normalizedValue}
          defaultValue={defaultValue}
          onValueChange={handleValueChange}
          onFileReject={onFileReject}
          onFileAccept={onFileAccept}
          onAccept={onAccept}
          accept={computedAccept}
          maxFiles={computedMaxFiles}
          maxSize={maxSize}
          disabled={disabled}
          multiple={false}
          invalid={hasError}
        >
          <div className="flex items-center gap-4">
            <FileUploadDropzone
              className={cn(
                "relative flex size-24 shrink-0 items-center justify-center rounded-full border border-dashed",
                "bg-background hover:bg-accent/10 transition-colors",
                "data-[invalid=true]:border-red-500",
                dropzoneClassName,
              )}
            >
              {avatarFile ? (
                <div className="group relative size-full overflow-hidden rounded-full">
                  {previewUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={previewUrl}
                      alt="Avatar preview"
                      className="size-full rounded-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 hidden items-center justify-center bg-black/40 group-hover:flex">
                    <span className="text-xs text-white">Change</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <ImagePlus className="text-muted-foreground size-6" />
                  <span className="text-muted-foreground mt-1 text-xs">Upload</span>
                </div>
              )}
              <FileUploadTrigger asChild>
                <button
                  type="button"
                  aria-label="Choose avatar"
                  className="absolute inset-0 rounded-full focus-visible:outline-none"
                />
              </FileUploadTrigger>
            </FileUploadDropzone>

            <div className="space-y-2">
              <p className="text-sm font-medium">Avatar</p>
              <p className="text-muted-foreground text-xs">
                PNG, JPG, GIF up to {formatMaxSize(maxSize)}
              </p>
              {avatarFile && (
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground text-sm">
                    <span className="text-foreground font-medium">{avatarFile.name}</span>
                    <span className="ml-2 text-xs">{Math.round(avatarFile.size / 1024)} KB</span>
                  </div>
                  <FileUploadClear asChild>
                    <Button variant="ghost" size="sm" disabled={disabled}>
                      Remove
                    </Button>
                  </FileUploadClear>
                </div>
              )}
            </div>
          </div>

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
        </FileUpload>
      </div>
    );
  }

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

      <FileUpload
        id={id}
        className="w-full"
        value={normalizedValue}
        defaultValue={defaultValue}
        onValueChange={handleValueChange}
        onFileReject={onFileReject}
        onFileAccept={onFileAccept}
        onAccept={onAccept}
        accept={computedAccept}
        maxFiles={computedMaxFiles}
        maxSize={maxSize}
        disabled={disabled}
        multiple={computedMultiple}
        invalid={hasError}
        aria-invalid={hasError}
        aria-describedby={cn(error && `${id}-error`, description && `${id}-description`)}
      >
        <FileUploadDropzone
          className={cn(
            "cursor-pointer rounded-md border-dashed bg-neutral-50 p-4 text-center transition-colors hover:bg-neutral-100",
            "data-[invalid=true]:border-red-500",
            dropzoneClassName,
          )}
        >
          <div className="flex flex-col items-center gap-1 text-center">
            <div className="flex items-center justify-center rounded-md border p-2.5">
              <Upload className="text-muted-foreground size-4" />
            </div>
            <p className="mt-3 text-sm font-medium">Drag & drop files here</p>

            <p className="text-muted-foreground text-xs">
              {description ?? "Drag & drop files here"}
            </p>
          </div>
          <FileUploadTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 w-fit cursor-pointer hover:bg-gray-100 hover:text-gray-800"
            >
              Browse files
            </Button>
          </FileUploadTrigger>
        </FileUploadDropzone>

        <FileUploadList className={cn(listClassName)}>
          {(normalizedValue ?? []).map((file, index) => (
            <FileUploadItem key={index} value={file}>
              <FileUploadItemPreview />
              <FileUploadItemMetadata />
              <FileUploadItemDelete asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="cursor-pointer hover:bg-red-100 hover:text-red-800"
                >
                  <X />
                  <span className="sr-only">Delete</span>
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>

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
      </FileUpload>
    </div>
  );
}

function formatMaxSize(maxSize?: number) {
  if (!maxSize) return "5MB";
  const mb = Math.round((maxSize / (1024 * 1024)) * 10) / 10;
  return `${mb}MB`;
}

export default FileUploadField;
