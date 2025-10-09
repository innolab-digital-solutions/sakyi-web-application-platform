import { Permission } from "@/types/admin/permission";

/**
 * Combines multiple permission maps into a single consolidated map.
 *
 * This utility function takes either a single permission object or an array of permission objects
 * and merges them into a unified permission structure. When multiple permissions contain the same
 * module key, their actions are merged together, with later permissions overriding earlier ones
 * for duplicate action keys.
 *
 * @param permissions - Single permission object or array of permission objects to combine
 * @returns A consolidated record where keys are module names and values are action maps
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
 * Gets the count of unique permission modules.
 *
 * Calculates the total number of distinct permission modules across all provided
 * permissions. This is useful for determining the scope of a role's access.
 *
 * @param permissions - Single permission object or array of permission objects
 * @returns The number of unique permission modules
 */
export const getPermissionModuleCount = (permissions: Permission | Permission[]): number => {
  const combinedModules = combinePermissions(permissions);
  return Object.keys(combinedModules).length;
};

/**
 * Gets permission module names for display purposes.
 *
 * Extracts all unique module names from the provided permissions. This is commonly
 * used for generating UI elements like permission lists or access summaries.
 *
 * @param permissions - Single permission object or array of permission objects
 * @returns Array of module names sorted alphabetically
 */
export const getPermissionModuleNames = (permissions: Permission | Permission[]): string[] => {
  const combinedModules = combinePermissions(permissions);
  return Object.keys(combinedModules);
};

/**
 * Gets all available actions for a specific permission module.
 *
 * Retrieves the action keys for a given module from the combined permissions.
 * Returns an empty array if the module doesn't exist in the permissions.
 *
 * @param permissions - Single permission object or array of permission objects
 * @param moduleKey - The module identifier to get actions for
 * @returns Array of action keys for the specified module
 */
export const getModuleActions = (
  permissions: Permission | Permission[],
  moduleKey: string,
): string[] => {
  const combinedModules = combinePermissions(permissions);
  return Object.keys(combinedModules[moduleKey] ?? {});
};

/**
 * Checks if the provided permissions contain any accessible modules.
 *
 * Determines whether a role or user has at least one permission module assigned.
 * This is useful for conditional rendering and access control logic.
 *
 * @param permissions - Single permission object or array of permission objects
 * @returns True if any permissions exist, false otherwise
 */
export const hasAnyPermissions = (permissions: Permission | Permission[]): boolean => {
  return getPermissionModuleCount(permissions) > 0;
};

// eslint-disable-next-line no-commented-code/no-commented-code
/**
 * Checks if a specific permission exists in the provided permissions.
 *
 * Searches through all modules and actions to find a specific permission by its action value.
 * This is useful for authorization checks where you need to verify if a role/user has
 * a specific permission like roles.view, programs.create, etc.
 *
 * @param permissions - Single permission object or array of permission objects
 * @param permissionAction - The permission action to check for (e.g., roles.view, programs.create)
 * @returns True if the permission exists, false otherwise
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
 * Checks if a user has a specific permission.
 *
 * This function determines whether the provided user permissions object contains
 * the specified permission string (e.g., "staffs.view"). It supports both single
 * Permission objects and arrays of Permission objects, but only checks the first
 * Permission object if an array is provided.
 *
 * @param userPermissions - The user's permissions object or undefined
 * @param permission - The permission string to check (e.g., "staffs.view")
 * @returns True if the user has the specified permission, false otherwise
 */
export const can = (userPermissions: Permission | undefined, permission: string): boolean => {
  if (!userPermissions) return false;

  // Handle both single Permission object and array of Permission objects
  const permissions = Array.isArray(userPermissions) ? userPermissions[0] : userPermissions;

  if (!permissions) return false;

  // Split permission string (e.g., 'staffs.view' -> ['staffs', 'view'])
  const [module, action] = permission.split(".");

  if (!module || !action) return false;

  // Check if the module exists and has the specific action
  return permissions[module]?.[action] === permission;
};
