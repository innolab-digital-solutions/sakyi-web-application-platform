"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronDown, ChevronRight, Save, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ENDPOINTS } from "@/config/endpoints";
import { META_ENDPOINTS } from "@/config/endpoints/meta";
import { useForm } from "@/hooks/use-form";
import { http } from "@/lib/api/client";
import {
  AssignPermissionsFormData,
  AssignPermissionsSchema,
} from "@/lib/validations/admin/role-schema";
import { Role } from "@/types/admin/role";
import {
  combinePermissions,
  getModuleActions,
  getPermissionModuleNames,
} from "@/utils/admin/permissions";
import { getStoredToken } from "@/utils/auth/storage";

interface AssignPermissionsFormProperties {
  roleId: string;
}

interface Permission {
  name: string;
  module: string;
  action: string;
}

interface ModulePermissions {
  [module: string]: {
    [action: string]: string;
  };
}

export default function AssignPermissionsForm({ roleId }: AssignPermissionsFormProperties) {
  const { token } = getStoredToken();
  const queryClient = useQueryClient();
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set());

  // Fetch role data
  const {
    data: role,
    isLoading: loadingRole,
    isError: roleError,
    error: roleErrorData,
  } = useQuery({
    queryKey: ["admin-roles", roleId],
    queryFn: async () => {
      const response = await http.get<Role>(ENDPOINTS.ADMIN.ROLES.SHOW(roleId), {
        requireAuth: true,
        token: token,
      });

      if (response.status === "error") {
        throw new Error(response.message);
      }

      return response.data;
    },
    enabled: !!token && !!roleId,
    retry: (failureCount, error: any) => {
      if (error?.status === 404) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Fetch meta permissions
  const {
    data: metaPermissions,
    isLoading: loadingPermissions,
    isError: permissionsError,
    error: permissionsErrorData,
  } = useQuery({
    queryKey: ["meta-permissions"],
    queryFn: async () => {
      const response = await http.get<Record<string, Record<string, string>>>(
        META_ENDPOINTS.PERMISSIONS,
        {
          requireAuth: true,
          token: token,
        },
      );

      if (response.status === "error") {
        throw new Error(response.message);
      }

      return response.data;
    },
    enabled: !!token,
  });

  // Generate dynamic permissions based on meta permissions API
  const allPermissions = useMemo(() => {
    if (!metaPermissions) return [];

    const permissions: Permission[] = [];

    // Generate permissions from meta permissions API
    for (const [module, actions] of Object.entries(metaPermissions)) {
      for (const [action, permissionName] of Object.entries(actions)) {
        permissions.push({
          name: permissionName,
          module: module,
          action: action.charAt(0).toUpperCase() + action.slice(1).replaceAll("_", " "),
        });
      }
    }

    return permissions;
  }, [metaPermissions]);

  // Initialize form with current role permissions using utility functions
  const currentPermissions = useMemo(() => {
    if (!role?.permissions) return [];

    const permissions: string[] = [];
    const combinedModules = combinePermissions(role.permissions);

    // Extract all permission names from the combined modules
    for (const actions of Object.values(combinedModules)) {
      for (const permissionName of Object.values(actions)) {
        permissions.push(permissionName);
      }
    }

    return permissions;
  }, [role]);

  const form = useForm<AssignPermissionsFormData>(
    { permissions: currentPermissions },
    {
      validate: AssignPermissionsSchema,
      requireAuth: true,
    },
  );

  // Update form when role changes
  React.useEffect(() => {
    if (role) {
      form.setData("permissions", currentPermissions);
      form.setDefaults({ permissions: currentPermissions });
    }
  }, [role, currentPermissions]);

  // Handle error states
  React.useEffect(() => {
    if (roleError && roleErrorData) {
      toast.error(roleErrorData.message || "Failed to load role data");
    }
  }, [roleError, roleErrorData]);

  React.useEffect(() => {
    if (permissionsError && permissionsErrorData) {
      toast.error(permissionsErrorData.message || "Failed to load permissions data");
    }
  }, [permissionsError, permissionsErrorData]);

  // Initialize expanded modules based on role permissions or default modules
  React.useEffect(() => {
    if (expandedModules.size === 0) {
      let modulesToExpand: string[] = [];

      if (role?.permissions) {
        // If role has permissions, expand modules that have permissions
        const moduleNames = getPermissionModuleNames(role.permissions);
        modulesToExpand = moduleNames.slice(0, 3);
      } else if (metaPermissions) {
        // If no role permissions but we have meta permissions, expand first 3 modules
        const moduleNames = Object.keys(metaPermissions);
        modulesToExpand = moduleNames.slice(0, 3);
      } else {
        // Fallback to default modules
        modulesToExpand = ["roles", "programs", "users"];
      }

      setExpandedModules(new Set(modulesToExpand));
    }
  }, [role, metaPermissions, expandedModules.size]);

  // Group permissions by module
  const permissionsByModule = useMemo(() => {
    if (!allPermissions) return {};

    const grouped: { [module: string]: Permission[] } = {};

    for (const permission of allPermissions) {
      if (!grouped[permission.module]) {
        grouped[permission.module] = [];
      }
      grouped[permission.module].push(permission);
    }

    return grouped;
  }, [allPermissions]);

  // Mutation for updating permissions
  const updatePermissionsMutation = useMutation({
    mutationFn: async (permissions: string[]) => {
      if (!role) throw new Error("Role not found");

      const response = await http.put(
        ENDPOINTS.ADMIN.ROLES.ASSIGN_PERMISSIONS(role.id),
        { permissions },
        {
          requireAuth: true,
          token: token,
        },
      );

      if (response.status === "error") {
        throw new Error(response.message);
      }

      return response;
    },
    onSuccess: (response) => {
      // Invalidate role queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["admin-roles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-roles", role?.id] });

      toast.success(response.message || "Permissions updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update permissions");
    },
  });

  const handlePermissionChange = (permissionName: string, checked: boolean) => {
    const currentPermissions = form.data.permissions || [];

    if (checked) {
      form.setData("permissions", [...currentPermissions, permissionName]);
    } else {
      form.setData(
        "permissions",
        currentPermissions.filter((p) => p !== permissionName),
      );
    }
  };

  const handleModuleToggle = (module: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(module)) {
      newExpanded.delete(module);
    } else {
      newExpanded.add(module);
    }
    setExpandedModules(newExpanded);
  };

  const handleSelectAll = () => {
    if (!allPermissions) return;

    const allPermissionNames = allPermissions.map((p) => p.name);
    form.setData("permissions", allPermissionNames);
  };

  const handleUnselectAll = () => {
    form.setData("permissions", []);
  };

  const handleSelectModule = (module: string) => {
    const modulePermissions = permissionsByModule[module] || [];
    const currentPermissions = form.data.permissions || [];
    const modulePermissionNames = modulePermissions.map((p) => p.name);

    // Add module permissions that aren't already selected
    const newPermissions = [...new Set([...currentPermissions, ...modulePermissionNames])];
    form.setData("permissions", newPermissions);
  };

  const handleUnselectModule = (module: string) => {
    const modulePermissions = permissionsByModule[module] || [];
    const currentPermissions = form.data.permissions || [];
    const modulePermissionNames = new Set(modulePermissions.map((p) => p.name));

    // Remove module permissions
    const newPermissions = currentPermissions.filter((p) => !modulePermissionNames.has(p));
    form.setData("permissions", newPermissions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!role) {
      toast.error("Role not found");
      return;
    }

    updatePermissionsMutation.mutate(form.data.permissions || []);
  };

  const isModuleSelected = (module: string) => {
    const modulePermissions = permissionsByModule[module] || [];
    const currentPermissions = form.data.permissions || [];
    const modulePermissionNames = modulePermissions.map((p) => p.name);

    return modulePermissionNames.every((permission) => currentPermissions.includes(permission));
  };

  const isModulePartiallySelected = (module: string) => {
    const modulePermissions = permissionsByModule[module] || [];
    const currentPermissions = form.data.permissions || [];
    const modulePermissionNames = modulePermissions.map((p) => p.name);

    const selectedCount = modulePermissionNames.filter((permission) =>
      currentPermissions.includes(permission),
    ).length;

    return selectedCount > 0 && selectedCount < modulePermissionNames.length;
  };

  if (loadingRole || loadingPermissions) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span className="text-lg">
            {loadingRole ? "Loading role data..." : "Loading permissions..."}
          </span>
        </div>
      </div>
    );
  }

  if (roleError || permissionsError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-red-600">Error Loading Data</h2>
          <p className="text-gray-600">
            {roleError ? "Failed to load role data" : "Failed to load permissions data"}
          </p>
        </div>
      </div>
    );
  }

  if (!role) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-600">Role Not Found</h2>
          <p className="text-gray-500">The requested role could not be found.</p>
        </div>
      </div>
    );
  }

  if (!metaPermissions || allPermissions.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-600">No Permissions Available</h2>
          <p className="text-gray-500">There are no permissions available to assign.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assign Permissions</h1>
          <p className="mt-2 text-gray-600">
            Configure access control by assigning specific permissions to this role
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
          >
            Select All
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleUnselectAll}
            className="border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Permissions Assignment Section */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-semibold text-slate-900">
                Permission Modules
              </CardTitle>
              <CardDescription className="mt-1 text-slate-600">
                Select permissions from each module to define role capabilities
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <span className="font-medium">{Object.keys(permissionsByModule).length} modules</span>
              <span>•</span>
              <span className="font-medium">{allPermissions.length} total permissions</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-1">
            {Object.entries(permissionsByModule).map(([module, permissions]) => (
              <div key={module} className="group border-b border-slate-100 last:border-b-0">
                {/* Module Header */}
                <div className="bg-white px-6 py-4 transition-all duration-200 hover:bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleModuleToggle(module)}
                        className="h-8 w-8 p-0 transition-colors hover:bg-slate-200"
                      >
                        {expandedModules.has(module) ? (
                          <ChevronDown className="h-4 w-4 text-slate-600" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-slate-600" />
                        )}
                      </Button>

                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isModuleSelected(module)}
                          ref={(element) => {
                            if (element) {
                              element.indeterminate = isModulePartiallySelected(module);
                            }
                          }}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              handleSelectModule(module);
                            } else {
                              handleUnselectModule(module);
                            }
                          }}
                          className="h-5 w-5 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=indeterminate]:border-blue-600 data-[state=indeterminate]:bg-blue-600"
                        />

                        <div>
                          <h3 className="text-base font-semibold text-slate-900 capitalize">
                            {module} Module
                          </h3>
                          <p className="text-sm text-slate-500">
                            {permissions.length} permission{permissions.length === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectModule(module)}
                        className="h-8 px-3 text-xs text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                      >
                        Select All
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUnselectModule(module)}
                        className="h-8 px-3 text-xs text-slate-600 transition-colors hover:bg-slate-200 hover:text-slate-900"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Module Permissions */}
                {expandedModules.has(module) && (
                  <div className="border-t border-slate-100 bg-slate-50/30 px-6 py-4">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {permissions.map((permission) => (
                        <div
                          key={permission.name}
                          className="group/permission flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
                        >
                          <Checkbox
                            id={permission.name}
                            checked={form.data.permissions?.includes(permission.name) || false}
                            onCheckedChange={(checked) =>
                              handlePermissionChange(permission.name, checked as boolean)
                            }
                            className="mt-0.5 h-4 w-4 data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600"
                          />
                          <label htmlFor={permission.name} className="flex-1 cursor-pointer">
                            <div className="text-sm font-medium text-slate-900 transition-colors group-hover/permission:text-blue-700">
                              {permission.action}
                            </div>
                            <div className="mt-1 inline-block rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-500">
                              {permission.name}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Submit Section */}
            <div className="border-t border-slate-200 bg-gradient-to-r from-slate-50 to-white px-6 py-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600">
                  <span className="font-medium">
                    {form.data.permissions?.length || 0} permissions selected
                  </span>
                  {form.isDirty && (
                    <span className="ml-2 font-medium text-amber-600">• Unsaved changes</span>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={updatePermissionsMutation.isPending || !form.isDirty}
                  className="flex items-center gap-2 bg-blue-600 px-6 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updatePermissionsMutation.isPending ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Permissions
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
