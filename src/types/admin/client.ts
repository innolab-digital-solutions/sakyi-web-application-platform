import { ApiResponse } from "@/types/shared/api";

export interface Enrollment {
  id: number;
  code: string;
  status: "pending" | "active" | "completed" | "cancelled";
  started_at: string | null;
  ended_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  notes: string | null;
  team: {
    id: number;
    name: string;
  };
  program: {
    id: number;
    code: string;
    title: string;
  };
}

export interface Client {
  id: number;
  public_id: string;
  last_activity: string | null;
  profile: {
    name: string;
    email: string;
    phone: string;
    picture: string;
    dob: string;
    gender: "male" | "female" | "other" | null;
    address: string;
    focus: {
      goal: string | null;
      interests: string[] | null;
    };
  };
  enrollments: Enrollment[];
}

export type ClientApiResponse = ApiResponse<Client[]> | undefined;
