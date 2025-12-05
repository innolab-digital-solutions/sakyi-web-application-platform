"use client";

import React, { forwardRef } from "react";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/utils/shared/cn";

export interface TextareaFieldProperties extends Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "id"
> {
  id: string;
  label?: React.ReactNode;
  error?: string;
  description?: string;
  inputClassName?: string;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  descriptionClassName?: string;
  required?: boolean;
}

export const TextareaField = forwardRef<HTMLTextAreaElement, TextareaFieldProperties>(
  (
    {
      id,
      label,
      error,
      description,
      inputClassName,
      containerClassName,
      labelClassName,
      errorClassName,
      descriptionClassName,
      required = false,
      disabled = false,
      ...properties
    },
    reference,
  ) => {
    const hasError = Boolean(error);

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

        <Textarea
          ref={reference}
          id={id}
          className={cn(hasError && "border-red-500 focus-visible:ring-red-500", inputClassName)}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={cn(error && `${id}-error`, description && `${id}-description`)}
          {...properties}
        />

        {error && (
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
      </div>
    );
  },
);

TextareaField.displayName = "TextareaField";

export default TextareaField;
