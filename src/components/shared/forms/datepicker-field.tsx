"use client";

import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utils/shared/cn";

export interface DatepickerFieldProperties {
  id: string;
  name?: string;
  label?: React.ReactNode;
  description?: string;
  error?: string;
  placeholder?: string;
  value?: string; // expected format: YYYY-MM-DD
  onChange?: (value?: string) => void;
  disabled?: boolean;
  required?: boolean;
  allowClear?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  descriptionClassName?: string;
  errorClassName?: string;
  buttonClassName?: string;
  popoverClassName?: string;
}

function formatDateToDMY(date: Date | undefined): string | undefined {
  if (!date) return undefined;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-based
  const year = date.getFullYear();

  return `${day}-${month}-${year}`; // display format
}

function formatDateToYYYYMMDD(date: Date | undefined): string | undefined {
  if (!date) return undefined;

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${year}-${month}-${day}`; // value format
}

function parseYYYYMMDDToDate(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default function DatepickerField({
  id,
  name,
  label,
  description,
  error,
  placeholder = "Select date",
  value,
  onChange,
  disabled = false,
  required = false,
  containerClassName,
  labelClassName,
  descriptionClassName,
  errorClassName,
  buttonClassName,
  popoverClassName,
}: DatepickerFieldProperties) {
  const [open, setOpen] = React.useState(false);
  const selectedDate = React.useMemo(() => parseYYYYMMDDToDate(value), [value]);
  const hasError = Boolean(error);

  const handleSelect = (date?: Date) => {
    const formatted = formatDateToYYYYMMDD(date);
    onChange?.(formatted);
    setOpen(false);
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

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            name={name}
            variant="outline"
            aria-expanded={open}
            aria-invalid={hasError}
            aria-describedby={cn(error && `${id}-error`, description && `${id}-description`)}
            disabled={disabled}
            className={cn(
              selectedDate ? "text-foreground hover:!text-foreground" : "text-muted-foreground",
              "h-11 w-full justify-between hover:!bg-transparent",
              hasError && "border-red-500 focus-visible:ring-red-500",
              buttonClassName,
            )}
          >
            <span className="truncate font-normal">
              {selectedDate ? formatDateToDMY(selectedDate) : placeholder}
            </span>
            <div className="flex items-center gap-1">
              <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn("w-auto overflow-hidden p-2", popoverClassName)}
          align="start"
          sideOffset={8}
        >
          <Calendar
            mode="single"
            captionLayout="dropdown"
            selected={selectedDate}
            onSelect={(date) => handleSelect(date)}
          />
        </PopoverContent>
      </Popover>

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
}
