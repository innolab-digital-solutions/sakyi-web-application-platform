"use client";

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import DisabledTooltip from "@/components/shared/disabled-tooltip";
import { Button } from "@/components/ui/button";
import { ENDPOINTS } from "@/config/endpoints";
import { useRequest } from "@/hooks/use-request";
import { User, UserApiResponse } from "@/types/admin/user";

interface UserStatusButtonProperties {
  user: User;
  className?: string;
}

export default function UserStatusButton({ user, className }: UserStatusButtonProperties) {
  const request = useRequest();

  const isActive = user.status === "active";
  const isLoading = request.loading;

  const handleStatusToggle = () => {
    if (isLoading) return;

    const newStatus = isActive ? "suspended" : "active";

    request.patch(
      ENDPOINTS.ADMIN.USERS.STATUS(user.id),
      { status: newStatus },
      {
        tanstack: {
          invalidateQueries: ["admin-users"],
          mutationOptions: {
            onSuccess: () => {
              // Optimistic cache update
              request.queryCache.setQueryData<UserApiResponse>(
                ["admin-users"],
                (previous) => {
                  if (!previous || previous.status !== "success" || !Array.isArray(previous.data)) {
                    return previous;
                  }

                  return {
                    ...previous,
                    data: previous.data.map((u) =>
                      u.id === user.id ? { ...u, status: newStatus } : u,
                    ),
                  } as UserApiResponse;
                },
                { all: true },
              );

              // Update the specific user cache if available
              request.queryCache.setQueryData(
                ["admin-user", String(user.id)],
                (previous: unknown) => {
                  if (
                    !previous ||
                    typeof previous !== "object" ||
                    !("status" in previous) ||
                    (previous as { status: string }).status !== "success"
                  ) {
                    return previous;
                  }
                  const previous_ = previous as {
                    status: string;
                    data: User;
                    message?: string;
                  };
                  return {
                    ...previous_,
                    data: { ...previous_.data, status: newStatus },
                  };
                },
                { all: true },
              );

              toast.success(
                `User account ${newStatus === "active" ? "activated" : "suspended"} successfully.`,
              );
            },
            onError: (error) => {
              toast.error(error.message);
            },
          },
        },
      },
    );
  };

  return (
    <DisabledTooltip reason={undefined}>
      <Button
        variant="outline"
        className={`hover:bg-accent/10! group hover:text-accent! hover:ring-none! flex w-full cursor-pointer! items-center justify-start gap-1.5 border-none! text-sm font-medium text-gray-700 shadow-none disabled:hover:bg-transparent! disabled:hover:text-inherit! ${className ?? ""}`}
        onClick={handleStatusToggle}
        disabled={isLoading}
        aria-label={isActive ? "Suspend user account" : "Activate user account"}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin transition-colors duration-150" />
        ) : isActive ? (
          <XCircle className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
        ) : (
          <CheckCircle className="group-hover:text-accent h-4 w-4 transition-colors duration-150" />
        )}
        <span>{isActive ? "Suspend Account" : "Activate Account"}</span>
      </Button>
    </DisabledTooltip>
  );
}
