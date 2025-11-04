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
 * Handles permissions where the module might itself contain dots (e.g., "food.categories.view").
 * Splits on the last dot, so the module part can contain dots or dashes.
 * Avoids using the `module` variable name, and prefers `slice` over `substring`.
 *
 * @param userPermissions - User's permission object
 * @param permission - Permission string to check (e.g., "roles.view", "food.categories.view")
 * @returns True if user has the permission
 *
 * @example
 * ```ts
 * can(user.permissions, "roles.view")  // true if user can view roles
 * can(user.permissions, "roles.create") // true if user can create roles
 * can(user.permissions, "food.categories.view") // works with modules with dots
 * ```
 */
export const can = (userPermissions: Permission | undefined, permission: string): boolean => {
  if (!userPermissions) return false;

  const permissions = Array.isArray(userPermissions) ? userPermissions[0] : userPermissions;

  if (!permissions) return false;

  const lastDotIndex = permission.lastIndexOf(".");
  if (lastDotIndex === -1) return false;

  const moduleKey = permission.slice(0, lastDotIndex);
  const action = permission.slice(lastDotIndex + 1);

  return permissions[moduleKey]?.[action] === permission;
};
