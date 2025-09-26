export type SortDirection = "asc" | "desc";

export type ListQueryParameters = {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: SortDirection;
} & Record<string, string | number | boolean | undefined | null>;
