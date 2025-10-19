/* eslint-disable no-commented-code/no-commented-code */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges and deduplicates Tailwind CSS class names
 *
 * Combines multiple class values using clsx and resolves Tailwind
 * class conflicts with tailwind-merge. Later classes override earlier
 * ones when conflicts occur (e.g., `cn('px-4', 'px-6')` returns `'px-6'`).
 *
 * @param inputs - Class values to merge (strings, objects, arrays)
 * @returns Merged and deduplicated class string
 *
 * @example
 * ```tsx
 * cn('px-4 py-2', 'bg-blue-500')
 * // => 'px-4 py-2 bg-blue-500'
 *
 * cn('px-4', { 'text-red-500': isError })
 * // => 'px-4 text-red-500' (if isError is true)
 *
 * cn('px-4', 'px-6')
 * // => 'px-6' (later class wins)
 * ```
 */
export const cn = (...inputs: ClassValue[]): string => {
  return twMerge(clsx(inputs));
};
