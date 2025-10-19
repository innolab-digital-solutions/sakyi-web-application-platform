import { ApiResponse } from "../shared/api";

export interface Unit {
  id: number;
  name: string;
  abbreviation: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface UnitsResponse {
  status: string;
  message: string;
  data: Unit[];
  meta: {
    pagination: {
      total: number;
      count: number;
      per_page: number;
      current_page: number;
      total_pages: number;
      links: {
        next: string | null;
        previous: string | null;
      };
    };
  };
}

export type UnitApiResponse = ApiResponse<Unit[]> | undefined;

export type UnitFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<Unit>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  name?: string;
  abbreviation?: string;
};
