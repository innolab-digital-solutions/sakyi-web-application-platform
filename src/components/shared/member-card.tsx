"use client";

import { X } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MemberCardProperties {
  id: number;
  name: string;
  role?: string;
  email?: string;
  picture?: string;
  matchPercentage?: number;
  onRemove?: (id: number) => void;
}

export default function MemberCard({ id, name, role, picture, onRemove }: MemberCardProperties) {
  return (
    <div className="rounded-md border border-gray-200 bg-white p-2 shadow-sm transition-shadow duration-200">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100 text-base font-semibold text-indigo-700">
            <Avatar>
              <AvatarImage src={picture ?? undefined} alt={name} />
              <AvatarFallback>{name?.[0] ?? "M"}</AvatarFallback>
            </Avatar>
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
