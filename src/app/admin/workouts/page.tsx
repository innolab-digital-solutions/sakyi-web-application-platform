import type { Metadata } from "next";

import WorkoutForm from "@/components/admin/features/workouts/workout-form";
import WorkoutTable from "@/components/admin/features/workouts/workout-table";
import CreateButton from "@/components/admin/shared/create-button";
import ResourceListPage from "@/components/admin/shared/resource-list-page";

export const metadata: Metadata = {
  title: "Workouts — SaKyi Health & Wellness",
  description:
    "Manage and organize workouts with categories, difficulty levels, and multimedia resources to support fitness programs.",
};

export default function WorkoutListPage() {
  return (
    <ResourceListPage
      title="Exercises"
      description="Manage your workout library with detailed exercise information. Add, edit, and organize workouts with categories, difficulty levels, equipment, and multimedia resources to support comprehensive fitness programs."
      createTrigger={<WorkoutForm mode="create" trigger={<CreateButton label="Add Exercise" />} />}
      table={<WorkoutTable />}
    />
  );
}
