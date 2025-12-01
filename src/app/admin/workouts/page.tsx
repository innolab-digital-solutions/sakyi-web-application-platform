import { Dumbbell } from "lucide-react";
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
      icon={Dumbbell}
      title="Workouts"
      description="Add, edit, and maintain workouts with categories, difficulty levels, instructional videos, and GIFs—your single source of truth for fitness content."
      createTrigger={<WorkoutForm mode="create" trigger={<CreateButton label="Add Workout" />} />}
      table={<WorkoutTable />}
    />
  );
}
