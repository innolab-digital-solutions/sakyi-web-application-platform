"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import React, { forwardRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/utils/shared/cn";

export interface ComboBoxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface ComboBoxFieldProperties {
  id: string;
  name?: string;
  label?: React.ReactNode;
  error?: string;
  description?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  options: ComboBoxOption[];
  value?: string;
  onChange?: (value: string) => void;
  onSelect?: (option: ComboBoxOption) => void;
  disabled?: boolean;
  required?: boolean;
  allowClear?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  errorClassName?: string;
  descriptionClassName?: string;
  buttonClassName?: string;
  popoverClassName?: string;
  commandClassName?: string;
}

export const ComboBoxField = forwardRef<HTMLButtonElement, ComboBoxFieldProperties>(
  (
    {
      id,
      name,
      label,
      error,
      description,
      placeholder = "Select option...",
      searchPlaceholder = "Search...",
      emptyMessage = "No option found.",
      options = [],
      value = "",
      onChange,
      onSelect,
      disabled = false,
      required = false,
      allowClear = false,
      containerClassName,
      labelClassName,
      errorClassName,
      descriptionClassName,
      buttonClassName,
      popoverClassName,
      commandClassName,
    },
    reference,
  ) => {
    const [open, setOpen] = useState(false);

    const hasError = Boolean(error);
    const selectedOption = options.find((option) => option.value === value);

    const handleSelect = (selectedValue: string) => {
      const option = options.find((opt) => opt.value === selectedValue);
      if (option && !option.disabled) {
        const newValue = selectedValue === value && allowClear ? "" : selectedValue;
        onChange?.(newValue);
        onSelect?.(option);
        setOpen(false);
      }
    };

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

        {/* ComboBox */}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={reference}
              id={id}
              name={name}
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-invalid={hasError}
              aria-describedby={cn(error && `${id}-error`, description && `${id}-description`)}
              disabled={disabled}
              className={cn(
                selectedOption?.value
                  ? "text-foreground hover:!text-foreground"
                  : "text-muted-foreground hover:!text-muted-foreground",
                "h-11 w-full cursor-pointer justify-between hover:!bg-transparent",
                // Error styling
                hasError && "border-red-500 focus-visible:ring-red-500",
                buttonClassName,
              )}
            >
              <span className="truncate font-normal">
                {selectedOption ? selectedOption.label : placeholder}
              </span>
              <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={cn("!w-[var(--radix-popover-trigger-width)] p-0", popoverClassName)}
            align="start"
            sideOffset={4}
            style={{ minWidth: "100%" }}
          >
            <Command className={commandClassName}>
              <CommandInput placeholder={searchPlaceholder} className="h-9" />
              <CommandList>
                <CommandEmpty>{emptyMessage}</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      onSelect={() => handleSelect(option.value)}
                      disabled={option.disabled}
                      className={cn(
                        option.disabled && "cursor-not-allowed opacity-50",
                        "hover:!bg-accent/10 hover:!text-accent text-foreground data-[selected=true]:!bg-primary/10 data-[selected=true]:!text-primary font-medium",
                      )}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

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

ComboBoxField.displayName = "ComboBoxField";

export default ComboBoxField;
