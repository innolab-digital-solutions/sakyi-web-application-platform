import { Permission } from "@/types/admin/permission";

/**
 * Combines multiple permission maps into a single consolidated map
 *
 * Merges permission objects, with later permissions overriding earlier
 * ones for duplicate module/action keys.
 *
 * @param permissions - Permission object(s) to combine
 * @returns Consolidated permission map (module → actions)
 */
export const combinePermissions = (
  permissions: Permission | Permission[],
): Record<string, Record<string, string>> => {
  const permissionMaps = Array.isArray(permissions)
    ? permissions
    : permissions
      ? [permissions]
      : [];

  const combinedModules: Record<string, Record<string, string>> = {};

  for (const map of permissionMaps) {
    for (const [moduleKey, actions] of Object.entries(map)) {
      const existingActions = combinedModules[moduleKey] ?? {};
      combinedModules[moduleKey] = { ...existingActions, ...actions };
    }
  }

  return combinedModules;
};

/**
 * Gets count of unique permission modules
 *
 * @param permissions - Permission object(s) to count
 * @returns Number of unique modules
 */
export const getPermissionModuleCount = (permissions: Permission | Permission[]): number => {
  const combinedModules = combinePermissions(permissions);
  return Object.keys(combinedModules).length;
};

/**
 * Gets permission module names
 *
 * @param permissions - Permission object(s) to extract from
 * @returns Array of module names
 */
export const getPermissionModuleNames = (permissions: Permission | Permission[]): string[] => {
  const combinedModules = combinePermissions(permissions);
  return Object.keys(combinedModules);
};

/**
 * Gets all actions for a specific module
 *
 * @param permissions - Permission object(s) to search
 * @param moduleKey - Module identifier
 * @returns Array of action keys, empty if module not found
 */
export const getModuleActions = (
  permissions: Permission | Permission[],
  moduleKey: string,
): string[] => {
  const combinedModules = combinePermissions(permissions);
  return Object.keys(combinedModules[moduleKey] ?? {});
};

/**
 * Checks if permissions contain any modules
 *
 * @param permissions - Permission object(s) to check
 * @returns True if any permissions exist
 */
export const hasAnyPermissions = (permissions: Permission | Permission[]): boolean => {
  return getPermissionModuleCount(permissions) > 0;
};

/**
 * Checks if specific permission exists
 *
 * Searches for a permission action string (e.g., "roles.view") across
 * all modules and actions.
 *
 * @param permissions - Permission object(s) to search
 * @param permissionAction - Permission to check (e.g., "roles.view")
 * @returns True if permission exists
 */
export const hasPermission = (
  permissions: Permission | Permission[],
  permissionAction: string,
): boolean => {
  const combinedModules = combinePermissions(permissions);

  for (const actions of Object.values(combinedModules)) {
    if (Object.values(actions).includes(permissionAction)) {
      return true;
    }
  }

  return false;
};

/**
 * Checks if user has a specific permission
 *
 * Primary permission checking function used throughout the application.
 * Parses permission string (e.g., "staffs.view") and validates against
 * user's permission structure.
 *
 * @param userPermissions - User's permission object
 * @param permission - Permission string to check (format: "module.action")
 * @returns True if user has the permission
 *
 * @example
 * ```ts
 * can(user.permissions, "roles.view")  // true if user can view roles
 * can(user.permissions, "roles.create") // true if user can create roles
 * ```
 */
export const can = (userPermissions: Permission | undefined, permission: string): boolean => {
  if (!userPermissions) return false;

  // Handle array of permissions (use first object)
  const permissions = Array.isArray(userPermissions) ? userPermissions[0] : userPermissions;

  if (!permissions) return false;

  const [module, action] = permission.split(".");

  if (!module || !action) return false;

  return permissions[module]?.[action] === permission;
};
