import { ApiResponse } from "@/types/shared/api";
import { Pagination } from "@/types/shared/common";

// Workout type
export interface Workout {
  id: number;
  name: string;
  description: string | null;
  equipment: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  gif_path: string | null;
  video_url: string | null;
  category: {
    id: number;
    name: string;
  } | null;
}

// API response type for workouts
export interface WorkoutsResponse {
  status: string;
  message: string;
  data: Workout[];
  meta: {
    pagination: Pagination;
  };
}

export interface EquipmentResponse {
  status: string;
  message: string;
  equipments: string[];
}

export type WorkoutApiResponse = ApiResponse<Workout[]> | undefined;

// Form properties for WorkoutForm
export type WorkoutFormProperties = {
  mode: "create" | "edit";
  trigger?: React.ReactNode;
  defaultValues?: Partial<Workout>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  description?: string;
};
