import { ApiResponse } from "@/types/shared/api";

export interface Enrollment {
  id: number;
  code: string;
  status: "scheduled" | "active" | "completed" | "cancelled";
  starts_at: string | null;
  ends_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  created_at: string;
  notes: string | null;
  client: {
    id: number;
    public_id: string;
    name: string;
    picture: string;
  };
  program: {
    id: number;
    code: string;
    title: string;
    thumbnail: string;
  };
  team: {
    id: number;
    name: string;
  };
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

export type EnrollmentApiResponse = ApiResponse<Enrollment> | undefined;
