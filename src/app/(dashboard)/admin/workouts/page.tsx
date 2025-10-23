import { Dumbbell } from "lucide-react";
import type { Metadata } from "next";

import WorkoutForm from "@/components/admin/features/workouts/workout-form";
import WorkoutTable from "@/components/admin/features/workouts/workout-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Workouts | SaKyi Health & Wellness",
  description:
    "Manage and organize workouts for all fitness levels. Add, edit, and categorize workouts with detailed descriptions, equipment, difficulty levels, and media to help users follow their training plans effectively.",
};

export default function UnitsListPage() {
  return (
    <ResourceListPage
      icon={Dumbbell}
      title="Workouts"
      description="Manage and organize workouts for all fitness levels. Add new workouts, update existing ones, and categorize them by type, difficulty, and required equipment. Include descriptions, GIFs, and video tutorials to make training plans comprehensive and easy to follow."
      createTrigger={<WorkoutForm mode="create" trigger={<CreateButton label="Add Workout" />} />}
      table={<WorkoutTable />}
    />
  );
}
