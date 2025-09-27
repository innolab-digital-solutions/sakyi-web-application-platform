export interface TableSearchConfig {
  keys: string[];
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export interface TablePaginationConfig {
  show?: boolean;
  pageSize?: number;
  pageCount?: number;
  totalItems?: number;
  currentPage?: number;
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

export interface TableSortingConfig {
  value?: import("@tanstack/react-table").SortingState;
  onChange?: (sorting: import("@tanstack/react-table").SortingState) => void;
}

export interface TableUIConfig {
  showToolbar?: boolean;
  showColumnVisibility?: boolean;
  showRowSelection?: boolean;
  toolbarActions?: React.ReactNode;
  emptyMessage?: string;
}

export interface TableServerConfig {
  enabled?: boolean;
  loading?: boolean;
}
