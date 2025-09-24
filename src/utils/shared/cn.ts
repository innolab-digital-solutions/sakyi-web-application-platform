/* eslint-disable no-commented-code/no-commented-code */
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class values into a single string of class names.
 *
 * @param inputs - An array of class values to merge
 * @returns A string of merged class names
 */
export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};
