"use client";

import { Eye, EyeOff } from "lucide-react";
import React, { forwardRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/shared/cn";

// prettier-ignore
export interface InputFieldProperties
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
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

export const InputField = forwardRef<HTMLInputElement, InputFieldProperties>(
  (
    {
      id,
      label,
      error,
      description,
      type = "text",
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
    const [showPassword, setShowPassword] = useState(false);

    const isPasswordField = type === "password";
    const inputType = isPasswordField && showPassword ? "text" : type;

    const hasError = Boolean(error);

    return (
      <div className={cn("space-y-2", containerClassName)}>
        {/* Label */}
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

        {/* Input Container */}
        <div className="relative">
          <Input
            ref={reference}
            id={id}
            type={inputType}
            className={cn(
              // Error styling
              hasError && "border-red-500 focus-visible:ring-red-500",
              // Password field padding
              isPasswordField && "pr-10",
              inputClassName,
            )}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={cn(error && `${id}-error`, description && `${id}-description`)}
            {...properties}
          />

          {/* Password Toggle Button */}
          {isPasswordField && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
              onClick={() => setShowPassword((previous) => !previous)}
              disabled={disabled}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="text-muted-foreground h-4 w-4" />
              ) : (
                <Eye className="text-muted-foreground h-4 w-4" />
              )}
            </Button>
          )}
        </div>

        {/* Description */}
        {description && (
          <p
            className={cn("text-muted-foreground text-sm", descriptionClassName)}
            id={`${id}-description`}
          >
            {description}
          </p>
        )}

        {/* Error Message */}
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

InputField.displayName = "InputField";

export default InputField;
