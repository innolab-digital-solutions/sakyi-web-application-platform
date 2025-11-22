import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface TeamMember {
  id: number;
  name: string;
  phone: string | null;
  email: string;
  role: string | null;
  picture: string | null;
  username: string | null;
  pivot_created_at: string;
  pivot_updated_at: string;
}

export interface Team {
  id: number;
  name: string;
  description: string | null;
  users: TeamMember[];
  created_at: string;
  updated_at: string;
  actions?: {
    editable?: boolean;
    deletable?: boolean;
  };
}

export interface TeamsResponse {
  status: string;
  message: string;
  data: Team[];
  meta: {
    pagination: Pagination;
  };
}

export type TeamApiResponse = ApiResponse<Team[]> | undefined;

export type TeamFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<Team>;
  open?: boolean;
  title?: string;
  onOpenChange?: (open: boolean) => void;
  // form fields for add/edit
  name?: string;
  description?: string;
  // user_id only relevant for edit page
  member_ids?: [];
};
