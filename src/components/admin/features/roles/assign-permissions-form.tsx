"use client";

import { CheckSquare, ShieldCheck, XSquare } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { ENDPOINTS } from "@/config/endpoints";
import { useForm } from "@/hooks/use-form";
import { useRequest } from "@/hooks/use-request";
import { AssignPermissionsSchema } from "@/lib/validations/admin/role-schema";
import { Role } from "@/types/admin/role";

type AssignPermissionsFormProperties = {
  role: Role;
};

export default function AssignPermissionsForm({ role }: AssignPermissionsFormProperties) {
  const { data, isFetching } = useRequest({
    url: ENDPOINTS.META.PERMISSIONS,
    queryKey: ["permissions"],
    requireAuth: true,
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
    for (const moduleKey of Object.keys(permissionsData)) {
      if (!initial[moduleKey]) initial[moduleKey] = new Set<string>();
    }
    setSelected(initial);
  }, [permissionsData]);

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
      const moduleSet = new Set(next[moduleKey] ?? []);
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
      requireAuth: true,
      tanstack: {
        invalidateQueries: ["admin-roles"],
        mutationOptions: {
          onSuccess: (response) => {
            toast.success(response.message);
          },
          onError: (error) => {
            toast.error(error.message);
          },
        },
      },
    },
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const picked: string[] = [];
    for (const [moduleKey, set] of Object.entries(selected)) {
      for (const actionKey of set) {
        const permissionString = permissionsData[moduleKey]?.[actionKey];
        if (permissionString) picked.push(permissionString);
      }
    }
    form.setData("permissions", picked);
    form.patch(ENDPOINTS.ADMIN.ROLES.ASSIGN_PERMISSIONS(role.id));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-semibold tracking-tight text-gray-800">
            Role: {role?.name}
          </h3>
          <p className="text-muted-foreground mt-0.5 text-[13px] font-medium">
            Choose the permissions to grant to this role. Use Select All to speed up.
          </p>
        </div>

        <div className="flex items-center space-x-5">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => toggleAll(!isAllChecked)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex cursor-pointer items-center space-x-2 !rounded-sm font-medium"
            disabled={isLoadingPermissions}
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
        <Button
          type="submit"
          variant="default"
          disabled={form.processing || isLoadingPermissions}
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
      </div>
    </form>
  );
}
