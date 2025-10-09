import { ListQueryParameters, SortDirection } from "@/types/shared/parameters";

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
 * Safely converts a string value to a positive number with fallback
 *
 * @param value - The string value to convert
 * @param fallback - The fallback number to use if conversion fails
 * @returns A positive finite number or the fallback value
 */
const toNumber = (value: string | null | undefined, fallback: number): number => {
  if (value === null || value === undefined) return fallback;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

/**
 * Validates and normalizes sort direction parameter
 *
 * @param value - The direction value to validate
 * @param fallback - The fallback direction if validation fails
 * @returns A valid sort direction ("asc" or "desc")
 */
const toDirection = (value: string | null | undefined, fallback: SortDirection): SortDirection => {
  return value === "asc" || value === "desc" ? value : fallback;
};

/**
 * Parses URL search parameters into structured list query parameters
 *
 * @param searchParameters - URLSearchParams object containing query string parameters
 * @param defaults - Default values to use for missing or invalid parameters
 * @returns Parsed and validated list query parameters with any additional filters
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

  // Include any additional filter parameters beyond the standard ones
  for (const [key, value] of searchParameters.entries()) {
    if (!(key in base)) base[key] = value;
  }

  return base;
};

/**
 * Converts list query parameters into a URL query string
 *
 * @param parameters - The list query parameters to serialize
 * @returns URL-encoded query string (without leading "?")
 */
export const serializeParameters = (parameters: ListQueryParameters): string => {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(parameters)) {
    if (value === undefined || value === null) continue;
    const stringValue = String(value);
    if (stringValue === "") continue; // Skip empty strings
    query.set(key, stringValue);
  }
  return query.toString();
};

/**
 * Merges list parameters with default values, ensuring all required fields are present
 *
 * @param parameters - The parameters to merge with defaults
 * @param defaults - Default values to use for missing parameters
 * @returns Complete list parameters with defaults applied
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
 * Merges current parameters with updates and applies validation rules
 *
 * @param current - Current list query parameters
 * @param updates - Parameter updates to apply
 * @param defaults - Default values for validation and fallbacks
 * @returns Normalized and validated merged parameters
 */
export const mergeParameters = (
  current: ListQueryParameters,
  updates: Partial<ListQueryParameters>,
  defaults: typeof DEFAULT_LIST_PARAMS = DEFAULT_LIST_PARAMS,
): ListQueryParameters => {
  const merged = { ...withDefaults(current, defaults), ...updates } as ListQueryParameters;

  // Ensure page and per_page are positive values
  if (merged.page && merged.page < 1) merged.page = 1;
  if (merged.per_page && merged.per_page < 1) merged.per_page = defaults.per_page;

  // Validate sort direction
  if (merged.direction !== "asc" && merged.direction !== "desc")
    merged.direction = defaults.direction;
  return merged;
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
