import { ApiResponse } from "@/types/shared/api";

export interface Instruction {
  id: number;
  title: string;
  total_days: number;
  start_date: string;
  end_date: string;
  status: "draft" | "active" | "completed" | "cancelled";
  notes: string;
  enrollment: {
    id: number;
    unique_id: string;
  };
  doctor: {
    id: number;
    name: string;
  };
  days: InstructionDay[];
  actions?: {
    editable?: boolean;
    deletable?: boolean;
  };
}

export interface InstructionDay {
  id?: number;
  day_number: number;
  date: string;
  notes: string;
  meals: InstructionMeal[];
  workouts: InstructionWorkout[];
  activities: InstructionActivity[];
  water: InstructionWater;
  sleep: InstructionSleep;
}

export interface InstructionMeal {
  id: number;
  calorie_target: number;
  notes: string;
  slot: {
    id: number;
    name: string;
  };
}

export interface InstructionWorkout {
  id: number;
  sets: number | null;
  reps: number | null;
  duration_min: number | null;
  notes: string;
  exercise: {
    id: number;
    name: string;
    description: string;
    gif: string;
    video: string;
    equipment: string | null;
    difficulty: string;
  };
}

export interface InstructionActivity {
  id: number;
  target_value: number;
  notes: string;
  activity: {
    id: number;
    name: string;
    description: string;
  };
}

export interface InstructionWater {
  id: number;
  target_ml: number;
  notes: string;
}

export interface InstructionSleep {
  id: number;
  target_hours: string;
  notes: string;
}

export type InstructionApiResponse = ApiResponse<Instruction[]> | undefined;
