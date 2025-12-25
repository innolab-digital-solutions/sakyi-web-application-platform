import { ApiResponse } from "@/types/shared/api";

export interface Unit {
  id: number;
  name: string;
  abbreviation: string;
  actions: {
    edit: {
      allowed: boolean;
      reasons: string[];
    };
    delete: {
      allowed: boolean;
      reasons: string[];
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
