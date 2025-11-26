import { Program } from "@/types/admin/program";
import { Team } from "@/types/admin/team";
import { User } from "@/types/admin/user";
import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface Enrollment {
  id: number;
  unique_id: string;
  user_id: number;
  team_id: number;
  program_id: number;
  submission_id: number;
  status: "pending" | "active" | "paused" | "completed" | "canceled";
  duration_value: number;
  duration_unit: "days" | "weeks" | "months";
  started_at: string;
  ended_at?: string | null;
  notes?: string | null;

  user: User;
  team: Team;
  program: Program;

  submission: {
    id: number;
    status: "pending" | "approved" | "rejected";
    notes?: string | null;
    reviewer_name?: string | null;
  };

  actions?: {
    editable?: boolean;
    deletable?: boolean;
  };
}

export interface EnrollmentsResponse {
  status: string;
  message: string;
  data: Enrollment[];
  meta: {
    pagination: Pagination;
  };
}

export type EnrollmentApiResponse = ApiResponse<Enrollment[]> | undefined;

export type EnrollmentFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<Enrollment>;
  open?: boolean;
  title?: string;
  onOpenChange?: (open: boolean) => void;

  user_id?: number;
  team_id?: number;
  program_id?: number;
  submission_id?: number;
  status?: "pending" | "active" | "paused" | "completed" | "canceled";
  duration_value?: number;
  duration_unit?: "days" | "weeks" | "months";
  started_at?: string;
  ended_at?: string;
  notes?: string;
};
