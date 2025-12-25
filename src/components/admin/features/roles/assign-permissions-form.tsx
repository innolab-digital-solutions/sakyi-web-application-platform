"use client";

import { CheckSquare, ShieldCheck, XSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ENDPOINTS } from "@/config/endpoints";
import { PATHS } from "@/config/paths";
import { useForm } from "@/hooks/use-form";
import { useRequest } from "@/hooks/use-request";
import { AssignPermissionsSchema } from "@/lib/validations/admin/role-schema";
import { Role } from "@/types/admin/role";

type AssignPermissionsFormProperties = {
  role: Role;
};

export default function AssignPermissionsForm({ role }: AssignPermissionsFormProperties) {
  const router = useRouter();
  const { data, isFetching } = useRequest({
    url: ENDPOINTS.LOOKUP.PERMISSIONS,
    queryKey: ["lookup-permissions"],
    staleTime: 1000 * 60 * 5,
  });

  const permissionsData = React.useMemo(() => {
    return (data?.data ?? {}) as Record<string, Record<string, string>>;
  }, [data]);

  const isLoadingPermissions = isFetching || Object.keys(permissionsData).length === 0;

  const [selected, setSelected] = React.useState<Record<string, Set<string>>>({});

  React.useEffect(() => {
    if (!permissionsData) return;
    const initial: Record<string, Set<string>> = {};

    const rolePermissionStrings = new Set<string>();
    if (role?.permissions) {
      const rolePermObject = Array.isArray(role.permissions)
        ? (role.permissions[0] as Record<string, Record<string, string>>)
        : (role.permissions as Record<string, Record<string, string>>);
      for (const actionMap of Object.values(rolePermObject || {})) {
        for (const perm of Object.values(actionMap || {})) {
          rolePermissionStrings.add(perm);
        }
      }
    }

    for (const [moduleKey, actionMap] of Object.entries(permissionsData)) {
      if (!initial[moduleKey]) initial[moduleKey] = new Set<string>();
      for (const [actionKey, permString] of Object.entries(actionMap)) {
        if (rolePermissionStrings.has(permString)) {
          initial[moduleKey].add(actionKey);
        }
      }
    }

    setSelected(initial);
  }, [permissionsData, role]);

  const isModuleAllChecked = (moduleKey: string) => {
    const actions = Object.keys(permissionsData[moduleKey] ?? {});
    const selectedCount = selected[moduleKey]?.size ?? 0;
    return actions.length > 0 && selectedCount === actions.length;
  };

  const isModuleIndeterminate = (moduleKey: string) => {
    const actions = Object.keys(permissionsData[moduleKey] ?? {});
    const selectedCount = selected[moduleKey]?.size ?? 0;
    return selectedCount > 0 && selectedCount < actions.length;
  };

  const allPermissions = React.useMemo(() => {
    return Object.values(permissionsData).flatMap((actionMap) => Object.values(actionMap));
  }, [permissionsData]);

  const isAllChecked = React.useMemo(() => {
    if (allPermissions.length === 0) return false;
    const picked = Object.entries(selected).flatMap(([moduleKey, set]) => {
      const items: (string | undefined)[] = [];
      for (const action of set) {
        items.push(permissionsData[moduleKey]?.[action]);
      }
      return items;
    });
    return picked.filter(Boolean).length === allPermissions.length;
  }, [allPermissions.length, selected, permissionsData]);

  const togglePermission = (moduleKey: string, actionKey: string, checked: boolean) => {
    setSelected((previous) => {
      const next = { ...previous };
      const moduleSet = new Set(next[moduleKey] || []);
      if (checked) moduleSet.add(actionKey);
      else moduleSet.delete(actionKey);
      next[moduleKey] = moduleSet;
      return next;
    });
  };

  const toggleModuleAll = (moduleKey: string, checked: boolean) => {
    setSelected((previous) => {
      const next = { ...previous };
      const actions = Object.keys(permissionsData[moduleKey] ?? {});
      next[moduleKey] = checked ? new Set(actions) : new Set<string>();
      return next;
    });
  };

  const toggleAll = (checked: boolean) => {
    setSelected(() => {
      const next: Record<string, Set<string>> = {};
      for (const [moduleKey, actionMap] of Object.entries(permissionsData)) {
        next[moduleKey] = checked ? new Set(Object.keys(actionMap)) : new Set<string>();
      }
      return next;
    });
  };

  const form = useForm(
    {
      permissions: [],
    },
    {
      validate: AssignPermissionsSchema,
      tanstack: {
        invalidateQueries: [
          ["admin-roles"],
          ...(role?.id ? [["admin-specific-role", String(role.id)]] : []),
          ["lookup-permissions"],
        ],
        mutationOptions: {
          onSuccess: async (response) => {
            toast.success(response.message);
            router.push(PATHS.ADMIN.ROLES.LIST);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      },
    },
  );

  // Keep form permissions in sync with selection so submission has up-to-date values
  React.useEffect(() => {
    const picked: string[] = [];
    for (const [moduleKey, set] of Object.entries(selected)) {
      for (const actionKey of set) {
        const perm = permissionsData[moduleKey]?.[actionKey];
        if (perm) picked.push(perm);
      }
    }
    const current = (form.data?.permissions as string[]) || [];
    const isSameLength = current.length === picked.length;
    const isSameOrder = isSameLength && current.every((value, index) => value === picked[index]);
    if (!isSameOrder) {
      form.setData("permissions", picked);
    }
  }, [selected, permissionsData, form]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.patch(ENDPOINTS.ADMIN.ROLES.ASSIGN_PERMISSIONS(role.id));
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "Enter" && event.target instanceof HTMLElement) {
      const isTextarea = event.target.tagName === "TEXTAREA";
      const targetElement = event.target as HTMLElement;
      const isSubmitButton =
        (targetElement instanceof HTMLButtonElement && targetElement.type === "submit") ||
        targetElement.closest('button[type="submit"]') !== null;

      if (!isTextarea && !isSubmitButton) {
        event.preventDefault();
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-gray-800">
            <span className="inline-block max-w-[280px] truncate align-middle" title={role?.name}>
              {role?.name !== undefined && role?.name !== null ? (
                role.name
              ) : (
                <Skeleton className="inline-block h-4 w-24 align-middle" />
              )}
            </span>
          </h3>
          {role?.description === undefined ? (
            <Skeleton className="mt-1 h-4 w-96" />
          ) : (
            <p className="text-muted-foreground mt-0.5 text-[13px] font-medium">
              {role.description ||
                "Choose the permissions to grant to this role. Use Select All to speed up."}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-5">
          {isLoadingPermissions ? (
            <Skeleton className="h-8 w-28" />
          ) : (
            <Button
              type="button"
              variant="default"
              size="sm"
              onClick={() => toggleAll(!isAllChecked)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex cursor-pointer items-center space-x-2 rounded-sm! font-medium"
            >
              {isAllChecked ? (
                <>
                  <XSquare className="h-2 w-2" />
                  Unselect all
                </>
              ) : (
                <>
                  <CheckSquare className="h-2 w-2" />
                  Select all
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {isLoadingPermissions ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="border-border/60 group rounded-md border p-4">
              <div className="mb-3 flex items-start justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-2 w-24" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Object.entries(permissionsData).map(([moduleKey, actionMap]) => {
            const actions = Object.keys(actionMap);
            const prettyTitle = moduleKey
              .replaceAll("-", " ")
              .replaceAll(/\b\w/g, (c) => c.toUpperCase());

            return (
              <div
                key={moduleKey}
                className="border-border/60 hover:border-border/90 group rounded-md border p-4 transition-colors"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h4 className="text-[13px] leading-none font-semibold tracking-tight text-gray-900">
                      {prettyTitle}
                    </h4>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {actions.length} available permissions
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      className="cursor-pointer"
                      checked={isModuleAllChecked(moduleKey)}
                      onCheckedChange={(value) => toggleModuleAll(moduleKey, Boolean(value))}
                      aria-checked={
                        isModuleAllChecked(moduleKey)
                          ? "true"
                          : isModuleIndeterminate(moduleKey)
                            ? "mixed"
                            : "false"
                      }
                    />
                    <span className="text-[12.5px] font-medium text-gray-700">Select all</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {actions.map((actionKey) => (
                    <label
                      key={actionKey}
                      className="hover:bg-muted flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Checkbox
                          className="cursor-pointer"
                          checked={selected[moduleKey]?.has(actionKey) ?? false}
                          onCheckedChange={(value) =>
                            togglePermission(moduleKey, actionKey, Boolean(value))
                          }
                        />
                        <span className="text-xs font-semibold text-gray-700 capitalize">
                          {actionKey}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Separator className="bg-gray-200" />

      <div className="flex justify-end space-x-2">
        <Button variant="outline" asChild>
          <Link
            href={PATHS.ADMIN.ROLES.LIST}
            className="flex items-center gap-2 text-sm font-semibold text-gray-800 hover:bg-gray-100! hover:text-gray-800!"
          >
            Cancel
          </Link>
        </Button>

        {isLoadingPermissions ? (
          <Skeleton className="h-9 w-32" />
        ) : (
          <Button
            type="submit"
            variant="default"
            disabled={form.processing}
            className="flex cursor-pointer items-center gap-2 font-semibold"
          >
            {form.processing ? (
              <>
                <Spinner />
                Saving Changes...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        )}
      </div>
    </form>
  );
}
