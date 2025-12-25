"use client";

import React, { forwardRef } from "react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/utils/shared/cn";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProperties {
  id: string;
  name?: string;
  label?: React.ReactNode;
  description?: string;
  error?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  required?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export const SelectField = forwardRef<HTMLButtonElement, SelectFieldProperties>(
  (
    {
      id,
      name,
      label,
      description,
      error,
      placeholder = "Select...",
      options,
      value,
      defaultValue,
      onChange,
      disabled = false,
      required = false,
      containerClassName,
      labelClassName,
      descriptionClassName,
      errorClassName,
      triggerClassName,
      contentClassName,
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

        <Select
          value={value}
          defaultValue={defaultValue}
          onValueChange={onChange}
          disabled={disabled}
        >
          <SelectTrigger
            ref={reference}
            id={id}
            name={name}
            aria-invalid={hasError}
            aria-describedby={cn(error && `${id}-error`, description && `${id}-description`)}
            className={cn(
              "h-11! w-full!",
              hasError && "border-red-500 focus-visible:ring-red-500",
              triggerClassName,
            )}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className={contentClassName}>
            <SelectGroup>
              {options.map((opt) => (
                <SelectItem
                  key={opt.value}
                  value={opt.value}
                  disabled={opt.disabled}
                  className={cn(
                    opt.disabled && "cursor-not-allowed opacity-50",
                    "hover:bg-accent/10! hover:text-accent! focus:bg-accent/10! focus:text-accent! text-foreground data-[selected=true]:bg-primary/10! data-[selected=true]:text-primary! font-medium",
                  )}
                >
                  {opt.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        {description && (
          <p
            className={cn("text-muted-foreground text-sm", descriptionClassName)}
            id={`${id}-description`}
          >
            {description}
          </p>
        )}

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

SelectField.displayName = "SelectField";

export default SelectField;
