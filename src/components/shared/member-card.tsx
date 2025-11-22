"use client";

import { X } from "lucide-react";

import { ImagePreview } from "../admin/shared/image-preview";

interface MemberCardProperties {
  id: number;
  name: string;
  role?: string;
  email?: string;
  picture?: string;
  matchPercentage?: number; // Added for the green badge
  onRemove?: (id: number) => void;
}

export default function MemberCard({ id, name, role, picture, onRemove }: MemberCardProperties) {
  // Determine the display value for the match badge
  const initial = name?.[0] ?? "?";
  return (
    // Card Container: rounded-xl, light background, padding
    <div className="rounded-xl bg-white p-2 shadow-md transition-shadow duration-200 hover:shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-base font-semibold text-indigo-700">
            {picture ? <ImagePreview src={picture} type="Avatar" /> : <span>{initial}</span>}
          </div>

          <div className="flex min-w-0 flex-col gap-1">
            {" "}
            <span className="truncate text-sm font-semibold text-gray-800" title={name}>
              {name}
            </span>
            {role && (
              <span className="truncate text-xs font-medium text-gray-500" title={role}>
                {role}
              </span>
            )}
          </div>
        </div>

        {/* Right Group: Remove Button */}
        {onRemove && (
          // Remove Button: Styled for clarity and pleasant interaction (rounded, subtle gray, hover turns red)
          <button
            onClick={() => onRemove(id)}
            className="hover:bg-primary shrink-0 cursor-pointer rounded-full p-1 text-gray-400 transition-colors hover:text-red-50"
            aria-label={`Remove ${name}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
