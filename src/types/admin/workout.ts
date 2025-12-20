import { ApiResponse } from "@/types/shared/api";

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

export type WorkoutApiResponse = ApiResponse<Workout[]> | undefined;

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
