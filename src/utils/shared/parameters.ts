import { ListQueryParameters, SortDirection } from "@/types/shared/parameters";

/**
 * Default pagination and sorting parameters for list/table views
 */
export const DEFAULT_LIST_PARAMS: Required<
  Pick<ListQueryParameters, "page" | "per_page" | "sort" | "direction">
> & {
  search?: string;
} = {
  page: 1,
  per_page: 10,
  sort: "id",
  direction: "desc",
  search: "",
};

/**
 * Safely converts string to positive number
 */
const toNumber = (value: string | null | undefined, fallback: number): number => {
  if (value === null || value === undefined) return fallback;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/**
 * Validates and normalizes sort direction
 */
const toDirection = (value: string | null | undefined, fallback: SortDirection): SortDirection => {
  return value === "asc" || value === "desc" ? value : fallback;
};

/**
 * Parses URL search parameters into structured list query parameters
 *
 * Extracts standard pagination/sorting parameters and preserves any
 * additional filter parameters. Validates and applies fallback values
 * for invalid inputs.
 *
 * @param searchParameters - URL search parameters to parse
 * @param defaults - Default values for missing/invalid parameters
 * @returns Parsed and validated list query parameters with filters
 */
export const parseListParameters = (
  searchParameters: URLSearchParams | Readonly<URLSearchParams> | undefined,
  defaults: typeof DEFAULT_LIST_PARAMS = DEFAULT_LIST_PARAMS,
): ListQueryParameters => {
  if (!searchParameters) return { ...defaults };

  const page = toNumber(searchParameters.get("page"), defaults.page);
  const per_page = toNumber(searchParameters.get("per_page"), defaults.per_page);
  const sort = (searchParameters.get("sort") || defaults.sort) ?? undefined;
  const direction = toDirection(searchParameters.get("direction"), defaults.direction);
  const search = (searchParameters.get("search") ?? defaults.search) || "";

  const base: ListQueryParameters = { page, per_page, sort, direction, search };

  // Preserve additional filter parameters
  for (const [key, value] of searchParameters.entries()) {
    if (!(key in base)) base[key] = value;
  }

  return base;
};

/**
 * Converts list query parameters to URL query string
 *
 * Serializes parameters, skipping undefined, null, and empty string values
 * to keep URLs clean.
 *
 * @param parameters - Parameters to serialize
 * @returns URL-encoded query string without leading "?"
 */
export const serializeParameters = (parameters: ListQueryParameters): string => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(parameters)) {
    if (value === undefined || value === null) continue;
    const stringValue = String(value);
    if (stringValue === "") continue;
    query.set(key, stringValue);
  }
  return query.toString();
};

/**
 * Merges parameters with default values
 *
 * @param parameters - Parameters to merge
 * @param defaults - Default values to fill in
 * @returns Complete parameters with defaults applied
 */
export const withDefaults = (
  parameters: ListQueryParameters,
  defaults: typeof DEFAULT_LIST_PARAMS = DEFAULT_LIST_PARAMS,
): ListQueryParameters => {
  return {
    ...defaults,
    ...parameters,
  };
};

/**
 * Merges and validates parameter updates
 *
 * Combines current parameters with updates, applies defaults, and validates
 * values to ensure page/per_page are positive and direction is valid.
 *
 * @param current - Current parameters
 * @param updates - Updates to apply
 * @param defaults - Default values for validation
 * @returns Merged and validated parameters
 */
export const mergeParameters = (
  current: ListQueryParameters,
  updates: Partial<ListQueryParameters>,
  defaults: typeof DEFAULT_LIST_PARAMS = DEFAULT_LIST_PARAMS,
): ListQueryParameters => {
  const merged = { ...withDefaults(current, defaults), ...updates } as ListQueryParameters;

  // Validate and normalize
  if (merged.page && merged.page < 1) merged.page = 1;
  if (merged.per_page && merged.per_page < 1) merged.per_page = defaults.per_page;
  if (merged.direction !== "asc" && merged.direction !== "desc")
    merged.direction = defaults.direction;

  return merged;
};

/**
 * Appends default list parameters to a path
 *
 * Adds standard pagination and sorting parameters to a path for consistent
 * navigation to list/table pages. Skips if path already has query parameters.
 *
 * @param path - Base path to append parameters to
 * @param options - Optional parameter overrides
 * @returns Path with default query parameters
 */
export const addDefaultListParameters = (
  path: string,
  options?: {
    page?: number;
    per_page?: number;
    sort?: string;
    direction?: "asc" | "desc";
  },
): string => {
  if (path.includes("?")) {
    return path;
  }

  const parameters = new URLSearchParams();
  parameters.set("page", String(options?.page ?? DEFAULT_LIST_PARAMS.page));
  parameters.set("per_page", String(options?.per_page ?? DEFAULT_LIST_PARAMS.per_page));
  parameters.set("sort", options?.sort ?? DEFAULT_LIST_PARAMS.sort);
  parameters.set("direction", options?.direction ?? DEFAULT_LIST_PARAMS.direction);

  return `${path}?${parameters.toString()}`;
};

/**
 * Builds a URL with default list parameters while optionally preserving certain values
 *
 * @param pathname - The pathname to build the URL for
 * @param currentSearchParameters - Current URLSearchParams to extract values from
 * @param options - Options for which parameters to preserve
 * @param options.preservePerPage - Whether to preserve the current per_page value (default: true)
 * @returns Complete URL with query parameters
 */
export const buildDefaultListUrl = (
  pathname: string,
  currentSearchParameters: URLSearchParams,
  options: { preservePerPage?: boolean } = {},
): string => {
  const { preservePerPage = true } = options;
  const query = new URLSearchParams();

  // Set default parameters
  query.set("page", String(DEFAULT_LIST_PARAMS.page));
  query.set(
    "per_page",
    preservePerPage
      ? currentSearchParameters.get("per_page") || String(DEFAULT_LIST_PARAMS.per_page)
      : String(DEFAULT_LIST_PARAMS.per_page),
  );
  query.set("sort", String(DEFAULT_LIST_PARAMS.sort));
  query.set("direction", String(DEFAULT_LIST_PARAMS.direction));

  return `${pathname}?${query.toString()}`;
};
