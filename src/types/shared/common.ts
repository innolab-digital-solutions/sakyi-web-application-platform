export interface Pagination {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
  has_more_pages: boolean;
  path: string;
  next_page_url: string | null;
  prev_page_url: string | null;
}
