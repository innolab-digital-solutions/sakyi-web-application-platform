import { ApiResponse } from "@/types/shared/api";

export interface TeamMember {
  id: number;
  name: string;
  picture: string | null;
  role: string | null;
}

export interface Team {
  id: number;
  name: string;
  description: string | null;
  members: TeamMember[];
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

export type TeamApiResponse = ApiResponse<Team[]> | undefined;

export type TeamFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<Team>;
  open?: boolean;
  title?: string;
  onOpenChange?: (open: boolean) => void;
  name?: string;
  description?: string;
  member_ids?: [];
};
