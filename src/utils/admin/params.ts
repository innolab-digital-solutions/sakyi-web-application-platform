export type SortDirection = "asc" | "desc";

export type ListQueryParams = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: SortDirection;
} & Record<string, string | number | boolean | undefined | null>;

export const DEFAULT_LIST_PARAMS: Required<
  Pick<ListQueryParams, "page" | "per_page" | "sort" | "direction">
> & {
  search?: string;
} = {
  page: 1,
  per_page: 5,
  sort: "id",
  direction: "desc",
  search: "",
};

const toNumber = (value: string | null | undefined, fallback: number): number => {
  if (value === null || value === undefined) return fallback;
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const toDirection = (value: string | null | undefined, fallback: SortDirection): SortDirection => {
  return value === "asc" || value === "desc" ? value : fallback;
};

export function parseListParams(
  searchParameters: URLSearchParams | Readonly<URLSearchParams> | undefined,
  defaults: typeof DEFAULT_LIST_PARAMS = DEFAULT_LIST_PARAMS,
): ListQueryParams {
  if (!searchParameters) return { ...defaults };

  const page = toNumber(searchParameters.get("page"), defaults.page);
  const per_page = toNumber(searchParameters.get("per_page"), defaults.per_page);
  const sort = (searchParameters.get("sort") || defaults.sort) ?? undefined;
  const direction = toDirection(searchParameters.get("direction"), defaults.direction);
  const search = (searchParameters.get("search") ?? defaults.search) || "";

  const base: ListQueryParams = { page, per_page, sort, direction, search };
  // Include any extra filters beyond the standard ones
  for (const [key, value] of searchParameters.entries()) {
    if (!(key in base)) base[key] = value;
  }
  return base;
}

export function serializeParams(parameters: ListQueryParams): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(parameters)) {
    if (value === undefined || value === null) continue;
    const stringValue = String(value);
    if (stringValue === "") continue; // omit empty
    query.set(key, stringValue);
  }
  return query.toString();
}

export function withDefaults(
  parameters: ListQueryParams,
  defaults: typeof DEFAULT_LIST_PARAMS = DEFAULT_LIST_PARAMS,
): ListQueryParams {
  return {
    ...defaults,
    ...parameters,
  };
}

export function mergeParams(
  current: ListQueryParams,
  updates: Partial<ListQueryParams>,
  defaults: typeof DEFAULT_LIST_PARAMS = DEFAULT_LIST_PARAMS,
): ListQueryParams {
  const merged = { ...withDefaults(current, defaults), ...updates } as ListQueryParams;
  // Normalize numbers
  if (merged.page && merged.page < 1) merged.page = 1;
  if (merged.per_page && merged.per_page < 1) merged.per_page = defaults.per_page;
  // Normalize direction
  if (merged.direction !== "asc" && merged.direction !== "desc")
    merged.direction = defaults.direction;
  return merged;
}
