import { Permission } from "@/types/admin/role";

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
export function combinePermissions(
  permissions: Permission | Permission[],
): Record<string, Record<string, string>> {
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
}

/**
 * Gets the count of unique permission modules.
 *
 * Calculates the total number of distinct permission modules across all provided
 * permissions. This is useful for determining the scope of a role's access.
 *
 * @param permissions - Single permission object or array of permission objects
 * @returns The number of unique permission modules
 */
export function getPermissionModuleCount(permissions: Permission | Permission[]): number {
  const combinedModules = combinePermissions(permissions);
  return Object.keys(combinedModules).length;
}

/**
 * Gets permission module names for display purposes.
 *
 * Extracts all unique module names from the provided permissions. This is commonly
 * used for generating UI elements like permission lists or access summaries.
 *
 * @param permissions - Single permission object or array of permission objects
 * @returns Array of module names sorted alphabetically
 */
export function getPermissionModuleNames(permissions: Permission | Permission[]): string[] {
  const combinedModules = combinePermissions(permissions);
  return Object.keys(combinedModules);
}

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
export function getModuleActions(
  permissions: Permission | Permission[],
  moduleKey: string,
): string[] {
  const combinedModules = combinePermissions(permissions);
  return Object.keys(combinedModules[moduleKey] ?? {});
}

/**
 * Checks if the provided permissions contain any accessible modules.
 *
 * Determines whether a role or user has at least one permission module assigned.
 * This is useful for conditional rendering and access control logic.
 *
 * @param permissions - Single permission object or array of permission objects
 * @returns True if any permissions exist, false otherwise
 */
export function hasAnyPermissions(permissions: Permission | Permission[]): boolean {
  return getPermissionModuleCount(permissions) > 0;
}
