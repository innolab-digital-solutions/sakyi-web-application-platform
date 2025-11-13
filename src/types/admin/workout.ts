import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

export interface Workout {
  id: number;
  name: string;
  description: string | null;
  gif: string;
  video?: string | null;
  equipment?: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: {
    id: number;
    name: string;
  };
  actions?: {
    editable?: boolean;
    deletable?: boolean;
  };
}

/**
 * API response containing multiple workouts with pagination
 */
export interface WorkoutsResponse {
  status: string;
  message: string;
  data: Workout[];
  meta: {
    pagination: Pagination;
  };
}

/**
 * Type for API response
 */
export type WorkoutApiResponse = ApiResponse<Workout[]> | undefined;

/**
 * Form properties for creating or editing a workout
 */
export type WorkoutFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<Workout>;
  open?: boolean;
  title?: string;
  onOpenChange?: (open: boolean) => void;
  name?: string;
  description?: string;
  gif?: string;
  video?: string;
  equipment?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
};
